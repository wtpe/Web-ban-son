"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import CartCard from "@/components/CartCard";
import { get_all_cart_Items } from "@/Services/common/cart";
import { setCart } from "@/utils/CartSlice";
import { setNavActive } from "@/utils/AdminNavSlice";
import { create_a_new_order } from "@/Services/common/order";
import {
  get_product_by_id,
  update_a_product,
  update_product_quantity,
} from "@/Services/Admin/product";

type Inputs = {
  fullName: string;
  address: string;
  phone: number;
};

interface userData {
  email: String;
  role: String;
  _id: String;
  name: String;
}

type Data = {
  productID: {
    productName: string;
    productPrice: String;
    _id: string;
    productImage: string;
    productWeight: number;
    productQuantity: number;
  };
  userID: {
    email: string;
    _id: string;
  };
  _id: string;
  quantity: number;
};

export default function Page() {
  const [loader, setLoader] = useState(false);
  const Router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(
    (state: RootState) => state.User.userData
  ) as userData | null;
  const cartData = useSelector((state: RootState) => state.Cart.cart) as
    | Data[]
    | null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Cookies.get("token") || user === null) {
      Router.push("/");
    }
    dispatch(setNavActive("Base"));
  }, [dispatch, Router]);

  // useEffect(() => {
  //     toast.warning("This is Dummy Website Don't add your Origial Details Here !")
  // }, [])

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    if (!user?._id) return Router.push("/");
    const cartData = await get_all_cart_Items(user?._id);
    if (cartData?.success) {
      dispatch(setCart(cartData?.data));
    } else {
      toast.error(cartData?.message);
    }
    setLoading(false);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(true);

    const finalData = {
      user: user?._id,
      orderItems: cartData?.map((item) => {
        return {
          product: item?.productID?._id,
          qty: item?.quantity,
        };
      }),
      shippingAddress: {
        fullName: data?.fullName,
        address: data?.address,
        phone: data?.phone,
      },
      paymentMethod: "PayPal",
      itemsPrice: totalPrice,
      shippingPrice: 10000,
      totalPrice: totalPrice + 10000,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: "Đang chờ",
      deliveredAt: new Date(),
    };

    const res = await create_a_new_order(finalData);
    if (res?.success) {
      toast.success(res?.message);

      for (const item of cartData!) {
        await updateProductQuantity(item.productID._id, item.quantity);
      }

      setTimeout(() => {
        Router.push("/");
      }, 1000);
      setLoader(false);
    } else {
      toast.error(res?.message);
      setLoader(false);
    }
  };

  const updateProductQuantity = async (productId: string, quantity: number) => {
    try {
      const product = await get_product_by_id(productId);

      if (!product.success) {
        throw new Error(product.message);
      }

      // Tính số lượng còn lại
      const remainingQuantity = product.data.productQuantity - quantity;

      const updateData = {
        _id: productId,
        productQuantity: remainingQuantity,
      };
      console.log("updateData", updateData);
      const response = await update_product_quantity(updateData);
      if (response?.success) {
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(`Lỗi cập nhật số lượng sản phẩm`);
    }
  };

  function calculateTotalPrice(myCart: Data[]) {
    const totalPrice = myCart?.reduce((acc, item) => {
      return (
        acc + Number(item?.quantity) * Number(item?.productID?.productPrice)
      );
    }, 0);

    return totalPrice;
  }

  const totalPrice = calculateTotalPrice(cartData as Data[]);

  return (
    <div className="w-full h-full bg-gray-50 px-2">
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
            Giỏ hàng
          </li>
        </ul>
      </div>
      <div className="w-full h-20 my-2 text-center">
        <h1 className="text-2xl py-2 dark:text-black">Giỏ hàng của bạn</h1>
      </div>

      {loading || loader ? (
        <div className="w-full  flex-col h-96 flex items-center justify-center ">
          <TailSpin
            height="50"
            width="50"
            color="orange"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p className="text-sm mt-2 font-semibold text-orange-500">
            Đang tải ....
          </p>
        </div>
      ) : (
        <div className="w-full  h-full flex-col md:flex-row flex items-start justify-center">
          <div className="md:w-2/3 w-full px-2 h-full flex-col items-end justify-end flex">
            <div className="w-full flex flex-col items-center py-2 overflow-auto h-96">
              {cartData?.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center flex-col">
                  <p className="my-4 mx-2 text-lg font-semibold ">
                    Không có sản phẩm trong giỏ hàng
                  </p>
                  <Link href={"/"} className="btn text-white">
                    Trang chủ
                  </Link>
                </div>
              ) : (
                cartData?.map((item: Data) => {
                  return (
                    <CartCard
                      key={item?._id}
                      productID={item?.productID}
                      userID={item?.userID}
                      _id={item?._id}
                      quantity={item?.quantity}
                    />
                  );
                })
              )}
            </div>
            <div className="w-full  py-2 my-2 flex justify-end ">
              <h1 className="py-2 tracking-widest mb-2  border-b px-6 border-orange-600 text-sm  flex flex-col ">
                {" "}
                Giá gốc :{" "}
                <span className="text-xl font-extrabold">
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) || 0}{" "}
                </span>{" "}
              </h1>
              <h1 className="py-2 tracking-widest mb-2  border-b px-6 border-orange-600 text-sm  flex flex-col ">
                {" "}
                Giá ship :{" "}
                <span className="text-xl font-extrabold"> 10,000 </span>{" "}
              </h1>
            </div>
            <div className="w-full  py-2 my-2 flex justify-end ">
              <h1 className="py-2 tracking-widest mb-2  border-b px-6 border-orange-600 text-sm  flex flex-col ">
                {" "}
                Thành tiền :{" "}
                <span className="text-xl font-extrabold">
                  {" "}
                  {(totalPrice + 10000).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                </span>{" "}
              </h1>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:w-1/3 px-2 w-full max-w-lg  py-2 flex-col "
          >
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Họ tên người nhận</span>
              </label>
              <input
                {...register("fullName", { required: true })}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
              {errors.fullName && (
                <span className="text-red-500 text-xs mt-2">
                  Trường nhập bắt buộc
                </span>
              )}
            </div>
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Địa chỉ</span>
              </label>
              <input
                {...register("address", { required: true })}
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
              />
              {errors.address && (
                <span className="text-red-500 text-xs mt-2">
                  Trường nhập bắt buộc
                </span>
              )}
            </div>

            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text">Số điện thoại</span>
              </label>
              <input
                {...register("phone", { required: true })}
                type="text"
                className="file-input file-input-bordered w-full "
              />
              {errors.phone && (
                <span className="text-red-500 text-xs mt-2">
                  Trường nhập bắt buộc
                </span>
              )}
            </div>

            <button className="btn btn-block mt-3">Đặt hàng</button>
            <>
            </>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
