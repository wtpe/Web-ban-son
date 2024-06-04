"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setNavActive } from "@/utils/AdminNavSlice";
import { RootState } from "@/Store/store";
import { get_product_by_id, update_a_product } from "@/Services/Admin/product";
import Cookies from "js-cookie";

type Inputs = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  feature: Boolean;
  price: Number;
  quantity: Number;

  norm: string;
  weight: Number;
  categoryID: string;
  // productColor: {
  //   colorCode: string;
  //   colorName: string;
  // }[];
};

type ProductData = {
  _id: string;
  productName: string;
  productDescription: string;
  productImage: string;
  productSlug: string;
  productPrice: Number;
  productQuantity: Number;

  productNorm: string;
  productWeight: Number;
  productFeatured: Boolean;
  productCategory: string;
  createdAt: string;
  updatedAt: string;
};

type CategoryData = {
  _id: string;
  categoryName: string;
  categoryDescription: string;
  categoryImage: string;
  categorySlug: string;
  createdAt: string;
  updatedAt: string;
};

interface pageParam {
  id: string;
}

interface userData {
  email: String;
  role: String;
  _id: String;
  name: String;
}

export default function Page({
  params,
  searchParams,
}: {
  params: pageParam;
  searchParams: any;
}) {
  const [loader, setLoader] = useState(false);
  const Router = useRouter();
  const dispatch = useDispatch();
  const [prodData, setprodData] = useState<ProductData | undefined>(undefined);
  const category = useSelector((state: RootState) => state.Admin.category) as
    | CategoryData[]
    | undefined;

  useEffect(() => {
    const user: userData | null = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
    if (!Cookies.get("token") || user?.role !== "admin") {
      Router.push("/");
    }
  }, [Router]);

  const { data, isLoading } = useSWR("/gettingProductbyID", () =>
    get_product_by_id(params.id)
  );
  if (data?.success !== true) toast.error(data?.message);

  useEffect(() => {
    setprodData(data?.data);
  }, [data]);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<Inputs>({
    criteriaMode: "all",
  });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "productColor",
  // });

  const setValueofFormData = () => {
    if (prodData) {
      setValue("name", prodData?.productName);
      setValue("description", prodData?.productDescription);
      setValue("slug", prodData?.productSlug);
      setValue("feature", prodData?.productFeatured);
      setValue("categoryID", prodData?.productCategory);
      setValue("weight", prodData?.productWeight);
      setValue("price", prodData?.productPrice);
      setValue("quantity", prodData?.productQuantity);

      setValue("norm", prodData?.productNorm);
      // setValue("productColor", prodData?.productColor);
    }
  };

  useEffect(() => {
    if (prodData) setValueofFormData();
  }, [prodData]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(false);

    const updatedData: Inputs = {
      _id: params.id,
      name:
        data.name !== prodData?.productName ? data.name : prodData?.productName,
      description:
        data.description !== prodData?.productDescription
          ? data.description
          : prodData?.productDescription,
      slug:
        data.slug !== prodData?.productSlug ? data.slug : prodData?.productSlug,
      feature:
        data.feature !== prodData?.productFeatured
          ? data.feature
          : prodData?.productFeatured,
      weight:
        data.weight !== prodData?.productWeight
          ? data.weight
          : prodData?.productWeight,
      norm:
        data.norm !== prodData?.productNorm ? data.norm : prodData?.productNorm,

      price:
        data.price !== prodData?.productPrice
          ? data.price
          : prodData?.productPrice,
      quantity:
        data.quantity !== prodData?.productQuantity
          ? data.quantity
          : prodData?.productQuantity,

      categoryID:
        data.categoryID !== prodData?.productCategory
          ? data.categoryID
          : prodData?.productCategory,
      // productColor:
      //   data.productColor !== prodData?.productColor
      //     ? data.productColor
      //     : prodData?.productColor,
    };

    console.log(updatedData);

    const res = await update_a_product(updatedData);
    if (res?.success) {
      toast.success(res?.message);
      dispatch(setNavActive("Base"));
      setTimeout(() => {
        Router.push("/Dashboard");
      }, 2000);
      setLoader(false);
    } else {
      toast.error(res?.message);
      setLoader(false);
    }
  };

  return (
    <div className="w-full dark:text-black p-4 min-h-screen  bg-gray-50 flex flex-col ">
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul>
          <li onClick={() => dispatch(setNavActive("Base"))}>
            <Link href={"/Dashboard"}>
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
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Cập nhật sản phẩm
          </li>
        </ul>
      </div>
      <div className="w-full h-20 my-2 text-center">
        <h1 className="text-2xl py-2 ">Cập nhật sản phẩm</h1>
      </div>
      {isLoading || loader ? (
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
        <div className="w-full h-full flex items-start justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-lg  py-2 flex-col "
          >
            <div className="form-control w-full max-w-full">
              <label className="label">
                <span className="label-text">Chọn danh mục</span>
              </label>
              <select
                {...register("categoryID", { required: true })}
                className="select select-bordered"
              >
                <option disabled selected>
                  Chọn 1 danh mục{" "}
                </option>
                {category?.map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.categoryName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Tên sản phẩm</span>
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                placeholder=""
                className="input input-bordered w-full"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-2">
                  Trường nhập bắt buộc
                </span>
              )}
            </div>
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Thể loại</span>
              </label>
              <input
                {...register("slug", { required: true })}
                type="text"
                placeholder=""
                className="input input-bordered w-full"
              />
              {errors.slug && (
                <span className="text-red-500 text-xs mt-2">
                  Trường nhập bắt buộc
                </span>
              )}
            </div>
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Giá</span>
              </label>
              <input
                {...register("price", { required: true })}
                type="number"
                placeholder=""
                className="input input-bordered w-full"
              />
              {errors.slug && (
                <span className="text-red-500 text-xs mt-2">
                  Trường nhập bắt buộc
                </span>
              )}
            </div>
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Số lượng</span>
              </label>
              <input
                {...register("quantity", { required: true })}
                type="number"
                placeholder=""
                className="input input-bordered w-full"
              />
              {errors.slug && (
                <span className="text-red-500 text-xs mt-2">
                  Trường nhập bắt buộc
                </span>
              )}
            </div>
            <div className="form-control w-full mb-2">
              <label className="label">
                <span className="label-text">Trọng lượng</span>
              </label>
              <input
                {...register("weight", { required: true })}
                type="number"
                placeholder=""
                className="input input-bordered w-full"
              />
              {errors.slug && (
                <span className="text-red-500 text-xs mt-2">
                  Trường nhập bắt buộc
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Description</span>
              </label>
              <textarea
                {...register("description", { required: true })}
                className="textarea textarea-bordered h-24"
                placeholder=""
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-xs mt-2">
                  Trường nhập bắt buộc
                </span>
              )}
            </div>
            <div className="form-control py-2">
              <label className="label cursor-pointer">
                <span className="label-text">Sản phẩm nổi bật</span>
                <input
                  {...register("feature")}
                  type="checkbox"
                  className="checkbox dark:border-black"
                />
              </label>
            </div>
            {prodData && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ảnh minh hoạ</span>
                </label>
                <Image
                  src={prodData?.productImage || ""}
                  alt="No Image Found"
                  width={200}
                  height={200}
                />
              </div>
            )}
            {/* {fields.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-2">
                <input
                  {...register(`productColor.${index}.colorCode`)}
                  placeholder="Mã màu"
                />
                <input
                  {...register(`productColor.${index}.colorName`)}
                  placeholder="Tên màu"
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Xoá
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ colorCode: "", colorName: "" })}
              className="btn btn-block w-32 text-white px-2 py-1 rounded"
            >
              Thêm màu
            </button> */}

            <button className="btn btn-block mt-3">Cập nhật</button>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
