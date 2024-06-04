import connectDB from "@/DB/connectDB";

import { NextResponse } from "next/server";
import Product from "@/model/Product";

export async function PUT(req: Request) {
  try {
    await connectDB();

      const {formData} = await req.json();
      const  { _id  ,productQuantity } = formData;
      console.log('data:',formData)
      const saveData = await Product.findByIdAndUpdate(_id , {productQuantity}  , { new: true });
      
      if (saveData) {
        return NextResponse.json({ success: true, message: "Cập nhật sản phẩm thành công" });

      } else {

        return NextResponse.json({ success: false, message: "Cập nhật sản phẩm thất bại" });
      }

  } catch (error) {

    console.log('Lỗi cập nhật sản phẩm ', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, hãy thử lại !' });

  }
}
