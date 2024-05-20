"use Client"

import React, { useEffect, useState } from 'react'

import { useSWRConfig } from "swr"
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';




type ProductData = {
  _id: string,
  productName: string,
  productDescription: string,
  productImage: string,
  productSlug: string,
  productPrice: Number,
  productQuantity: Number,
  productFeatured: Boolean,
  productCategory: {
    _id: string,
    categoryName: string,
    categorySlug: string
  },
  createdAt: string;
  updatedAt: string;
};



interface Order {
  createdAt: string;
  deliveredAt: string;
  isDelivered: boolean;
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



export default function OrdersDetailsDataTable() {
  const { mutate } = useSWRConfig()
  const router = useRouter();
  const [orderData, setOrderData] = useState<Order[] | []>([]);
  const data = useSelector((state: RootState) => state.Order.order) as Order[] | [];
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<Order[] | []>([]);


  useEffect(() => {
    setOrderData(data)
  }, [data])

  useEffect(() => {
    setFilteredData(orderData);
  }, [orderData])







  const columns = [
    {
      name: 'Mã đơn',
      selector: (row: Order) => row?._id,
      sortable: true,
    },
    {
      name: 'Tên khách hàng',
      selector: (row: Order) => row?.user?.name,
      sortable: true,
    },
    {
      name: 'Thành tiền',
      selector: (row: Order) => row?.totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
      sortable: true,
    },
    {
      name: 'Trạng thái',
      selector: (row: Order) => row?.isDelivered ? 'Hoàn thành' : 'Chưa xử lý',
      sortable: true,
    },
    {
      name: 'Hành động',
      cell: (row: Order) => (

        <button onClick={() => router.push(`/order/view-orders-details/${row?._id}`)} className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'>Chi tiết</button>

      )
    },

  ];



  return (
    <div className='w-full h-full'>
      <DataTable
        columns={columns}
        data={filteredData || []}
        key={'ThisOrdersData'}
        pagination
        keyField="id"
        title={`Danh sách đơn hàng`}
        fixedHeader
        fixedHeaderScrollHeight='700px'
        selectableRows
        selectableRowsHighlight
        persistTableHead
        subHeader
        
        className="bg-white px-4 h-5/6 "
      />

    </div>
  )
}

