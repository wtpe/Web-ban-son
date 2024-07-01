"use client"
import React, { useState } from 'react'

import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import FeaturedProduct from '@/components/FeaturedProduct'
import TopCategories from '@/components/TopCategories'
import { get_all_categories } from '@/Services/Admin/category'
import { get_all_products} from '@/Services/Admin/product'
import useSWR from 'swr'
import { toast, ToastContainer } from 'react-toastify'
import { setCategoryData, setCatLoading, setProdLoading, setProductData } from '@/utils/AdminSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import Loading from './loading'
import { setUserData } from '@/utils/UserDataSlice'
import { RootState } from '@/Store/store'
import ChatMessenger from '@/components/ChatMessenger'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'



export default function Home() {
  const dispatch = useDispatch();
  // const categoryLoading = useSelector((state: RootState) => state.Admin.catLoading)
  // const productLoading = useSelector((state: RootState) => state.Admin.productLoading)
  const [loading, setLoading] = useState(true)
  const [ratio, setRatio] = useState(16/9) 
  const Router = useRouter();

  useEffect(() => {
    const user = (localStorage.getItem('user'));
    if (!user) return;
    dispatch(setUserData(JSON.parse(user)));
  }, [])

  useEffect(() => {
    FetchDataOFProductAndCategory()
  }, [])

  const FetchDataOFProductAndCategory = async () => {
    const categoryData = await get_all_categories();
    if (categoryData?.success !== true) toast.error(categoryData?.message)
    dispatch(setCategoryData(categoryData?.data))

    const productData = await get_all_products();
    if (productData?.success !== true) toast.error(productData?.message)
    dispatch(setProductData(productData?.data))


    setLoading(false)
  }

  return (
    <>
      <Navbar />
      
      {
          <>
            <Hero setRatio={setRatio} />
            <TopCategories />
            <FeaturedProduct  />
            
          </>
        
      }
      {/* <ChatMessenger/> */}
      <Footer />
      <ToastContainer />
    </>
  )
}
