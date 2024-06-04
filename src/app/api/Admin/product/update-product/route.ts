import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Product from "@/model/Product";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {


      const data = await req.json();
      
      const  {name , _id  , description  , slug , feature , weight , price , categoryID,norm,quantity } = data
      // const { error } = AddProductSchema.validate(productColor);

      console.log('id',_id)
      

      const saveData = await Product.findByIdAndUpdate(_id , { productName : name , productDescription : description ,productSlug: slug , productPrice : price ,  productWeight : weight ,  productCategory : categoryID, productNorm : norm,productQuantity:quantity }  , { new: true });

      if (saveData) {

        return NextResponse.json({ success: true, message: "Cập nhật sản phẩm thành công" });

      } else {

        return NextResponse.json({ success: false, message: "Lỗi cập nhật sản phẩm" });

      }
    } else {
      return NextResponse.json({ success: false, message: "Lỗi đăng nhập" });
    }

  } catch (error) {

    console.log('Lỗi cập nhật sản phẩm ', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, hãy thử lại !' });

  }
}
