import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Bookmark from "@/model/Bookmark";
import Joi from "joi";


const bookmark = Joi.object({
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

            const { error } = bookmark.validate({ productID, userID });

            if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

            const findProd = await Bookmark.find({ productID: productID, userID: userID });
            if (findProd?.length > 0) return NextResponse.json({ success: false, message: "Đã tồn tại sản phẩm" })

            const saveData = await Bookmark.create(data);

            if (saveData) {
                return NextResponse.json({ success: true, message: "Đã thêm vào mục yêu thích" });
            } else {
                return NextResponse.json({ success: false, message: "Lỗi thêm vào mục yêu thích, hãy thử lại" });
            }
        } else {
            return NextResponse.json({ success: false, message: "Lỗi đăng nhập, hãy thử lại" });
        }
    } catch (error) {
        console.log('Lỗi thêm sản phẩm vào mục ưa thích', error);
        return NextResponse.json({ success: false, message: 'Có lỗi xảy ra, hãy thử lại' });
    }
}
