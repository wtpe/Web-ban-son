import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Order from "@/model/Order";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const  {_id,isDelivered} = data
      if(!_id) return NextResponse.json({ success: false, message: "Chưa có mã đơn hàng" });

      const saveData = await Order.findByIdAndUpdate(_id , { isDelivered}  , { new: true });

      if (saveData) {

        return NextResponse.json({ success: true, message: "Cập nhật thành công" });

      } else {

        return NextResponse.json({ success: false, message: "Lỗi cập nhật trạng thái đơn hàng" });

      }

    } else {

      return NextResponse.json({ success: false, message: "Lỗi đăng nhập" });

    }

  } catch (error) {

    console.log('Lỗi cập nhật trạng thái đơn hàng', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại' });

  }
}
