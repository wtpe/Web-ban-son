"use client"
import React  from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";





export default function  GettingDatasLength() {

  const userData = useSelector((state: RootState) => state.Admin.user);
   
  const catData = useSelector((state: RootState) => state.Admin.category);

  const prodData = useSelector((state: RootState) => state.Admin.product);

  const orderData = useSelector((state: RootState) => state.Admin.Order);

  const unprocess= orderData?.filter(e=>(e.isDelivered ==='Đang chờ')||(e.isDelivered ==='Đang giao') );
  const process= orderData?.filter(e=>e.isDelivered ===('Hoàn thành') );

  
  
  


  return [
    
    {
      icon: "FaUserAlt",
      color: "text-green-600",
      title: "Tài khoản",
      count: userData?.length || 0
    },
    {
      icon: "GiAbstract010",
      color: "text-blue-600",
      title: "Tổng sản phẩm",
      count: prodData?.length || 0
    },
    {
      icon: "CgMenuGridR",
      color: "text-purple-600",
      title: "Tổng danh mục",
      count: catData?.length || 0
    },
    {
      icon: "AiOutlineClockCircle",
      color: "text-yellow-600",
      title: "Đơn hàng chưa xử lý",
      count: unprocess?.length || 0,
    },
    
    {
      icon: "GrCompliance",
      color: "text-orange-600",
      title: "Đơn hàng đã hoàn thành",
      count: process?.length || 0,
    },
    {
      icon: "TfiStatsUp",
      color: "text-orange-600",
      title: "Doanh thu ngày",
      count: 0,
    },
  ]
}