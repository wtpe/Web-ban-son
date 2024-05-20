import User from '@/model/User';
import connectDB from '@/DB/connectDB';
import Joi from 'joi';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';


const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});


export async function POST (req : Request)  {
    await connectDB();

    const { email, password} = await req.json();
    const { error } = schema.validate({ email, password });

    if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });
    if(email === 'thanhngo2532002@gmail.com') return  NextResponse.json({ success: true, message: "Cập nhật mật khẩu thành công"  });

    try {
        const ifExist = await User.findOne({ email });
        if(ifExist?.role === 'admin') return   NextResponse.json({ success: true, message: "Cập nhật mật khẩu thành công"  });
        if(!ifExist) return NextResponse.json({ success: false, message: "Không tìm thấy email" });
        const hashedPassword = await hash(password, 12)
        const updatePassword =  await User.findOneAndUpdate({email  , password : hashedPassword });
        return NextResponse.json({ success: true, message: "Cập nhật mật khẩu thành công"  });
        
    } catch (error) {
        console.log('Lỗi quên mật khẩu ', error);
        return NextResponse.json({ success: false, message: "Có lỗi xảy ra, hãy thử lại" })
    }
}

