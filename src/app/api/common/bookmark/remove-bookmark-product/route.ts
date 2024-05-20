import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Bookmark from "@/model/Bookmark";


export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if(!id)  return NextResponse.json({ success: true, message: "Yêu cầu id" });

      const deleteData = await Bookmark.findByIdAndDelete(id);

      if (deleteData) {
        return NextResponse.json({ success: true, message: "Xoá thành công" });
      } else {
        return NextResponse.json({ success: false, message: "Lỗi xoá sản phẩm, hãy thử lại" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Lỗi đăng nhập" });
    }
  } catch (error) {
    console.log('Lỗi xoá sản phẩm mục ưa thích', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, hãy thử lại' });
  }
}
