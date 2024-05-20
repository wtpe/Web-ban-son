import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Product from "@/model/Product";


export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if(!id)  return NextResponse.json({ success: true, message: "Yêu cầu id" });

      const deleteData = await Product.findByIdAndDelete(id);

      if (deleteData) {
        return NextResponse.json({ success: true, message: "Xoá sản phẩm thành công" });
      } else {
        return NextResponse.json({ success: false, message: "Không xoá được sản phẩm, hãy thử lại" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Lỗi đăng nhập" });
    }
  } catch (error) {
    console.log('Lỗi xoá sản phẩm', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, hãy thử lại' });
  }
}
