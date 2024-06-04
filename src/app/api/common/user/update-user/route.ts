import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import User from "@/model/User";
import { NextResponse } from "next/server";


export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);
    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const  { _id  , role } = data;
      console.log('data',data)
      const saveData = await User.findByIdAndUpdate(_id , { role}  , { new: true });
      if (saveData) {

        return NextResponse.json({ success: true, message: "Cập nhật thành công !"});

      } else {

        return NextResponse.json({ success: false, message: "Lỗi cập nhật, hãy thử lại !" });

      }

    } else {

      return NextResponse.json({ success: false, message: "Lỗi đăng nhập" });

    }

  } catch (error) {

    console.log('Chưa cập nhật được tài khoản', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, hãy thử lại' });

  }
}
