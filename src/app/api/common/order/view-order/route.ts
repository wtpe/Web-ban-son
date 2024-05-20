import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import Order from "@/model/Order";
import AuthCheck from "@/middleware/AuthCheck";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ status: 400, success: false, message: 'Hãy đăng nhập tài khoản' });
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const getData = await Order.find({ user : id }).populate("orderItems.product").populate('user');
      if (getData) {
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ status: 204, success: false, message: 'Không tìm thấy đơn hàng' });
      }

    } else {
      return NextResponse.json({ success: false, message: "Chưa đăng nhập tài khoản !" });
    }


  } catch (error) {
    console.log('Lỗi hiển thị dữ liệu đơn hàng', error);
    return NextResponse.json({ status: 500, success: false, message: 'Có lỗi xảy ra, hãy thử lại' });
  }
}
