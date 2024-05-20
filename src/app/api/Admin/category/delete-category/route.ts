import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Category from "@/model/Category";


export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if(!id)  return NextResponse.json({ success: true, message: "Yêu cầu Danh mục id" });

      const deleteData = await Category.findByIdAndDelete(id);

      if (deleteData) {
        return NextResponse.json({ success: true, message: "Xoá danh mục thành công!" });
      } else {
        return NextResponse.json({ success: false, message: "Xảy ra lỗi, hãy thử lại!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Lỗi đăng nhập." });
    }
  } catch (error) {
    console.log('Không thể xoá!', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra!' });
  }
}
