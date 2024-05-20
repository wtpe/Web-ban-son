import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import Product from "@/model/Product";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if(!id) return NextResponse.json({status: 400 , success: false, message: 'Không có danh mục id.' });

    
  

   
      const getData = await Product.find({ 'productCategory' : id }).populate('productCategory' ,' categoryName categorySlug _id')
      if (getData) {
        return NextResponse.json({success  :true , data : getData});
      } else {
        return NextResponse.json({status: 204 , success: false, message: 'Không tìm thấy sản phẩm' });
      }
   
  } catch (error) {
    console.log('Lỗi hiển thị sản phẩm theo danh mục', error);
    return NextResponse.json({status : 500 , success: false, message: 'Có lỗi xảy ra, hãy thử lại !' });
  }
}
