import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Category from "@/model/Category";


export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {

    
    

    
      const getData = await Category.find({});
      if (getData) {
        return NextResponse.json({success  :true , data : getData});
      } else {
        return NextResponse.json({status: 204 , success: false, message: 'Không tìm thấy danh mục' });
      }
   
  } catch (error) {
    console.log('Lỗi hiển thị danh mục', error);
    return NextResponse.json({status : 500 , success: false, message: 'Có lỗi xảy ra, hãy thử lại!' });
  }
}
