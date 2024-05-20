import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Cart from "@/model/Cart";


export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if(!id)  return NextResponse.json({ success: true, message: "Yêu cầu id sản phẩm giỏ hàng" });

      const deleteData = await Cart.findByIdAndDelete(id);

      if (deleteData) {
        return NextResponse.json({ success: true, message: "Xoá thành công" });
      } else {
        return NextResponse.json({ success: false, message: "Lỗi xoá sản phẩm trong giỏ hàng, hãy thử lại !" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Chưa đăng nhập !" });
    }
  } catch (error) {
    console.log('Lỗi xoá sản phẩm trong giỏ hàng', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, hãy thử lại' });
  }
}
