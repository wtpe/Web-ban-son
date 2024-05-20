"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { RootState } from "@/Store/store";
import { useSelector } from "react-redux";
import { FaCartArrowDown, FaSearch } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdFavorite } from "react-icons/md";
import { get_product } from "@/Services/Admin/product";
import ProductCard from "./ProductCard";
import Search from "./Search";
// import searchResult from "@/app/api/search1/route";

type ProductData = {
  productName: string,
  productNorm: string,

  productImage: string,
  productSlug: string,
  productPrice: Number,
  productWeight: Number,

  productFeatured: Boolean,
  productCategory : {
      categoryName : string,
      categoryDescription  :string ,
      _id : string,
  },
  _id : string
};

export default function Navbar() {
  
  const [prodData, setprodData] = useState<ProductData[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.product);

  const router = useRouter();
  const [Scrolled, setScrolled] = useState(false);
  const user = useSelector((state: RootState) => state.User.userData);
  const [filteredData, setFilteredData] = useState<ProductData[] | []>([]);

  useEffect(() => {
    setprodData(data);
  }, [data]);

  useEffect(() => {
    setFilteredData(prodData);
  }, [prodData]);

  useEffect(() => {
    window.onscroll = () => {
      setScrolled(window.pageYOffset < 30 ? false : true);
      return () => (window.onscroll = null);
    };
  }, [Scrolled]);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.clear();
    location.reload();
  };

  // const getResult = async (query:string) => {
  //   try {
  //     const response = await get_product(query);
  //     setResultArr(response);
  //   } catch (error) {
  //     console.log("Lỗi tìm kiếm sản phẩm", error);
  //   }
  // };

  

  return (
    <div
      className={`navbar ${
        Scrolled ? "bg-white/95  " : "bg-transparent"
      }  fixed text-white top-0 left-0 z-50`}
    >
    
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-active text-white btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow text-black bg-gray-50 rounded-box w-52"
          >
            <li>
              <Link href={"/"}>Trang chủ</Link>
            </li>
            <li>
              <Link href={"/"}>Mua sắm</Link>
            </li>
            <li>
              <Link href={"/order/view-orders"}>Lịch sử mua hàng</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-end">
        <div className="flex-none">
          {user ? (
            <div className="flex items-center justify-center  min-h-full">
              
                
                  
                  <Search/>
                  
                  
                
                
              
              <button
                onClick={() => router.push("/order/create-order")}
                className="btn btn-circle  mx-2"
              >
                <FaCartArrowDown className="text-white text-xl" />
              </button>
              <button
                onClick={() => router.push("/bookmark")}
                className="btn btn-circle  mx-2"
              >
                <MdFavorite className="text-white text-xl" />
              </button>
              <button
                onClick={() => router.push("/order/view-orders")}
                className="btn btn-circle  mx-2"
              >
                <CiDeliveryTruck className="text-white text-xl" />
              </button>
              <button onClick={handleLogout}  className="btn text-white mx-2">
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="btn text-white mx-2"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
