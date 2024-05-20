import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Cart from "@/model/Cart";
import Joi from "joi";


const AddToCart = Joi.object({
    userID: Joi.string().required(),
    productID: Joi.string().required()
})





export const dynamic  = 'force-dynamic'

export async function POST(req: Request) {
    try {
        await connectDB();
        const isAuthenticated = await AuthCheck(req);

        if (isAuthenticated) {
            const data = await req.json();
            const { productID, userID } = data;

            const { error } = AddToCart.validate({ productID, userID });

            if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

            const findProd = await Cart.find({ productID: productID, userID: userID });
            if (findProd?.length > 0) return NextResponse.json({ success: false, message: "Sản phẩm đã tồn tại trong giỏ hàng" })

            const saveData = await Cart.create(data);

            if (saveData) {
                return NextResponse.json({ success: true, message: "Sản phẩm đã được thêm vào giỏ hàng" });
            } else {
                return NextResponse.json({ success: false, message: "Không thêm được sản phẩm vào giỏ hàng, hãy thử lại !" });
            }
        } else {
            return NextResponse.json({ success: false, message: "Hãy đăng nhập tài khoản !" });
        }
    } catch (error) {
        console.log('Lỗi thêm sản phẩm vào giỏ hàng', error);
        return NextResponse.json({ success: false, message: 'Có lỗi xảy ra. hãy thử lại' });
    }
}
