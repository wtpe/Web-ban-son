import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import Bookmark from "@/model/Bookmark";
import AuthCheck from "@/middleware/AuthCheck";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ status: 400, success: false, message: 'Hãy đăng nhập !' });
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const getData = await Bookmark.find({ userID: id }).populate('userID').populate('productID');
      if (getData) {
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ status: 204, success: false, message: 'Không tìm thấy sản phẩm' });
      }

    } else {
      return NextResponse.json({ success: false, message: "Lỗi đăng nhập, hãy đăng nhập" });
    }


  } catch (error) {
    console.log('Lỗi thêm sản phẩm', error);
    return NextResponse.json({ status: 500, success: false, message: 'Có lỗi xảy ra,hãy thử lại !' });
  }
}
