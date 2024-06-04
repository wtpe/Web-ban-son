import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Product from "@/model/Product";
import Joi from "joi";


export const AddProductSchema  = Joi.object({
  productName  : Joi.string().required(),
  productDescription  : Joi.string().required(),
  productImage  : Joi.string().required(),
  productWeight  : Joi.number().required(),
  productNorm : Joi.string().required(),
  productSlug  : Joi.string().required(),
  productPrice  : Joi.number().required(),
  productQuantity  : Joi.number().required(),
  productFeatured  : Joi.boolean().required(),
  productCategory : Joi.required(),
  // productColor: Joi.array().items(
  //   Joi.object({
  //     _id: Joi.string().required(),
  //     colorCode: Joi.string().required(),
  //     colorName: Joi.string().required()
  //   })
  // ).required()
})




export const dynamic  = 'force-dynamic'

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      
      const data = await req.json();

      const {productCategory , productDescription , productFeatured , productImage ,productName  , productPrice , productWeight , productSlug,productNorm, productQuantity } = data;

      const { error } = AddProductSchema.validate( {productCategory , productDescription , productFeatured , productImage ,productName  , productPrice , productWeight , productSlug,productNorm,productQuantity  });

      if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

      const saveData = await Product.create(data);

      if (saveData) {
        return NextResponse.json({ success: true, message: "Thêm sản phẩm thành công" });
      } else {
        return NextResponse.json({ success: false, message: "Lỗi thêm sản phẩm" });
      }
    } else {
      return NextResponse.json({ success: false, message: "Lỗi đăng nhập" });
    }
  } catch (error) {
    console.log('Lỗi thêm sản phẩm', error);
    return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại' });
  }
}
