"use client";
import { get_order_details } from "@/Services/common/order";
import { RootState } from "@/Store/store";
import Loading from "@/app/loading";
import GeneratePDF from "@/components/GeneratePDF";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GrDeliver } from "react-icons/gr";
import { TbListDetails } from "react-icons/tb";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

interface userData {
  email: String;
  role: String;
  _id: String;
  name: String;
}

interface Order {
  createdAt: string;
  deliveredAt: string;
  isDelivered: string;
  isPaid: boolean;
  itemsPrice: number;
  orderItems: {
    qty: number;
    product: {
      createdAt: string;
      productCategory: string;
      productDescription: string;
      productFeatured: boolean;
      productImage: string;
      productName: string;
      productNorm: string;
      productWeight: number;
      productPrice: number;
      productQuantity: number;
      productSlug: string;
      updatedAt: string;
      __v: number;
      _id: string;
    };
    _id: string;
  }[];
  paidAt: string;
  paymentMethod: string;
  shippingAddress: {
    address: string;
    fullName: string;
    phone: number;
  };
  shippingPrice: number;

  totalPrice: number;
  updatedAt: string;
  user: {
    email: string;
    name: string;
    password: string;
    role: string;
    __v: number;
    _id: string;
  };
  __v: number;
  _id: string;
}

interface pageParam {
  id: string;
}

export default function Page({
  params,
  searchParams,
}: {
  params: pageParam;
  searchParams: any;
}) {
  const Router = useRouter();

  const user = useSelector(
    (state: RootState) => state.User.userData
  ) as userData | null;
  const [orderData, setOrderData] = useState<Order>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user: userData | null = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
    if (!Cookies.get("token") || !user) {
      Router.push("/");
    }
  }, [Router]);

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    if (!user?._id) return Router.push("/");
    const orderData = await get_order_details(params?.id);
    if (orderData?.success) {
      setOrderData(orderData?.data);
      setLoading(false);
    } else {
      toast.error(orderData?.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 h-screen px-2 py-2">
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul className="dark:text-black">
          <li>
            <Link href={"/"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link href={"/order/view-orders"}>
              <GrDeliver className="w-4 h-4 mr-2 stroke-current" />
              Đơn hàng
            </Link>
          </li>
          <li>
            <TbListDetails className="w-4 h-4 mr-2 stroke-current" />
            Chi tiết đơn hàng
          </li>
        </ul>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full h-5/6 dark:text-black overflow-y-auto">
          <div className="w-full flex px-2 flex-wrap items-center  justify-center">
            {/*Order product Card */}
            {orderData?.orderItems.map((item, index) => {
              return (
                <div
                  key={index}
                  className="md:w-96 m-2 w-52 h-52 bg-gray-300  flex md:flex-row  flex-col items-center justify-start"
                >
                  <div className="relative w-1/2 h-full">
                    <Image
                      src={item?.product?.productImage}
                      alt="no Image Found"
                      fill
                    />
                  </div>
                  <div className="flex  px-2 py-1 flex-col items-start justify-start">
                    <h1 className="my-2">{item?.product?.productName}</h1>
                    <p className="text-sm my-2 font-semibold">
                      Giá :{" "}
                      {item?.product?.productPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <p className="text-sm  my-2">
                      Số lượng :{" "}
                      <span className="font-semibold">{item?.qty}</span>
                    </p>
                  </div>
                </div>
              );
            })}

            {/*Order product Card */}
          </div>
          <div className="flex flex-wrap w-full items-center justify-center">
            <div className=" border m-2 w-96  flex-col flex items-start justify-start py-2 px-4">
              <h1 className="text-xl font-semibold ">Địa chỉ giao hàng</h1>
              <div className="flex py-2 w-full text-sm justify-between">
                <p>Họ tên</p>
                <p className="font-semibold">
                  {orderData?.shippingAddress?.fullName}
                </p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between">
                <p>Địa chỉ</p>
                <p className="font-semibold">
                  {orderData?.shippingAddress?.address}
                </p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between">
                <p>Số điện thoại</p>
                <p className="font-semibold">
                  {orderData?.shippingAddress?.phone}
                </p>
              </div>
            </div>
            <div className=" border m-2 w-96  flex-col flex items-start justify-start py-2 px-4">
              <h1 className="text-xl font-semibold ">Chi tiết đơn</h1>
              <div className="flex py-2 w-full text-sm justify-between">
                <p>Sản phẩm</p>
                <p className="font-semibold">
                  Giá{" "}
                  {orderData?.itemsPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                </p>
              </div>

              <div className="flex py-2 w-full text-sm justify-between">
                <p>Thành tiền</p>
                <p className="font-semibold">
                  Giá{" "}
                  {orderData?.totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                </p>
              </div>
              <div className="flex py-2 w-full text-sm justify-between">
                <p>Thanh toán</p>
                <p className="font-semibold">
                  {orderData?.isPaid ? "Thanh toán" : "Chưa thanh toán"}
                </p>
              </div>
            </div>
            <GeneratePDF orderData1={orderData} />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
