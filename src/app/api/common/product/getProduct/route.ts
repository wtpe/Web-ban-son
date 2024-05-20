import connectDB from "@/DB/connectDB";

import { NextResponse } from "next/server";
import Product from "@/model/Product";


export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {

    const getData = await Product.find({}).populate('productCategory', ' categoryName categorySlug _id')
    if (getData) {
      return NextResponse.json({ success: true, data: getData });
    } else {
      return NextResponse.json({ status: 204, success: false, message: 'Không tìm thấy sản phẩm' });
    }

  } catch (error) {
    console.log('Lỗi hiển thị tất cả sản phẩm', error);
    return NextResponse.json({ status: 500, success: false, message: 'Có lỗi xảy ra, hãy thử lại' });
  }
}
