import connectDB from "@/DB/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/model/Product";
import { disconnect } from "process";


export const dynamic = 'force-dynamic'


export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const {searchParams} = new URL(req.url)
    const  query  = searchParams.get('query');;

    const getData = await Product.find({ productName: {$regex: query , $options: 'i'}  })
      if (getData) {
        return NextResponse.json({success  :true , data : getData});
      } else {
        return NextResponse.json({status: 204 , success: false, message: 'Không tìm thấy sản phẩm' });
      }
   
  } catch (error) {
    console.log('Lỗi hiển thị sản phẩm', error);
    return NextResponse.json({status : 500 , success: false, message: 'Có lỗi xảy ra, hãy thử lại' });
  }
}