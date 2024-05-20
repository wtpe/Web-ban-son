import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Category from "@/model/Category";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if(!id) return NextResponse.json({status: 400 , success: false, message: 'Yêu cầu id danh mục' });

    
    const isAuthenticated = await AuthCheck(req);

   
      const getData = await Category.findById(id);
      if (getData) {
        return NextResponse.json({success  :true , data : getData});
      } else {
        return NextResponse.json({status: 204 , success: false, message: 'Không tìm thấy danh mục' });
      }
    
  } catch (error) {
    console.log('Lỗi hiển thị danh mục', error);
    return NextResponse.json({status : 500 , success: false, message: 'Có lỗi xảy ra, hãy thử lại' });
  }
}
