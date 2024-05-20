import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Category from "@/model/Category";

export async function PUT(req: Request) {
  try {
    await connectDB();  
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const  {name , _id  , description  , slug } = data

      const saveData = await Category.findOneAndUpdate(_id , { categoryName : name , categoryDescription : description ,categorySlug: slug}  , { new: true });

      if (saveData) {

        return NextResponse.json({ success: true, message: "Cập nhật thành công !" });

      } else {

        return NextResponse.json({ success: false, message: "Lỗi cập nhật, hãy thử lại !" });

      }

    } else {

      return NextResponse.json({ success: false, message: "Lỗi đăng nhập" });

    }

  } catch (error) {

    console.log('Chưa cập nhật được danh mục', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, hãy thử lại' });

  }
}
