import Link from 'next/link'
import React from 'react'
import { RxDashboard } from 'react-icons/rx'
import { AiFillHome } from 'react-icons/ai'
import { BiCategory, BiUser } from 'react-icons/bi'
import { GiLoincloth } from 'react-icons/gi'
import { IoIosAddCircle } from 'react-icons/io'
import { MdOutlinePendingActions } from 'react-icons/md'
import { GrCompliance } from 'react-icons/gr'
import { setNavActive } from '@/utils/AdminNavSlice'
import { useDispatch } from 'react-redux'


export default function AdminSidebar() {
    const dispatch =  useDispatch();
    return (
        <div className='w-60 hidden dark:text-black md:block bg-white h-full'>
            <div className='w-full text-center py-2 px-2 h-20'>
                <h1 className='flex text-2xl font-semibold items-center justify-center'><RxDashboard className='mx-2' />Trang quản trị</h1>
            </div>
            <div className='w-full '>
                <ul className='flex px-4 flex-col items-start justify-center'>
                    <li onClick={() => dispatch(setNavActive('Base'))} className='py-3 px-1 mb-3'><button className='flex items-center justify-center'> <AiFillHome className='mx-2' /> Trang chủ</button></li>
                    <li onClick={() => dispatch(setNavActive('activeUsers'))} className='py-3 px-1 mb-3'><button className='flex items-center justify-center'> <BiUser className='mx-2' />  Tài khoản</button></li>
                    <li onClick={() => dispatch(setNavActive('activeCategories'))} className='py-3 px-1 mb-3'><button className='flex items-center justify-center'> <BiCategory className='mx-2' />  Danh mục</button></li>
                    <li onClick={() => dispatch(setNavActive('activeProducts'))} className='py-3 px-1 mb-3'><button className='flex items-center justify-center'> <GiLoincloth className='mx-2' />  Sản phẩm</button></li>
                    <li className='py-3 px-1 mb-3'><Link href={'/product/add-product'} className='flex items-center justify-center'> <IoIosAddCircle className='mx-2' /> Thêm sản phẩm</Link></li>
                    <li className='py-3 px-1 mb-3'><Link href={'/category/add-category'} className='flex items-center justify-center'> <IoIosAddCircle className='mx-2' /> Thêm danh mục</Link></li>
                    <li  className='py-3 px-1 mb-3' onClick={() => dispatch(setNavActive('activePendingOrder'))}><button className='flex items-center justify-center'> <MdOutlinePendingActions className='mx-2' /> Đơn hàng chưa xử lý</button></li>
                    <li  className='py-3 px-1 mb-3' onClick={() => dispatch(setNavActive('activeDeliveredOrder'))}><button className='flex items-center justify-center' > <GrCompliance className='mx-2' />Đơn hàng đã hoàn thành</button></li>
                    <li  className='py-3 px-1 mb-3' onClick={() => dispatch(setNavActive('activeStatisTable'))}><button className='flex items-center justify-center' > <GrCompliance className='mx-2' />Thống kê</button></li>
                </ul>
            </div>

        </div>
    )
}
