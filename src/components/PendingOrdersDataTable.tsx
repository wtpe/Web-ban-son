
"use Client"

import React, { useEffect, useState } from 'react'

import { useSWRConfig } from "swr"
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Image from 'next/image';
import Loading from '@/app/loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { delete_a_product } from '@/Services/Admin/product';
import { delete_a_bookmark_item, get_all_bookmark_items } from '@/Services/common/bookmark';
import { setBookmark } from '@/utils/Bookmark';
import { update_order_status } from '@/Services/Admin/order';


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


interface userData {
    email: String,
    role: String,
    _id: String,
    name: String
}


export default function PendingOrdersDataTable() {
    const { mutate } = useSWRConfig()
  const router = useRouter();
  const [orderData, setOrderData] = useState<Order[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.Order) as Order[] | [];
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<Order[] | []>([]);


  useEffect(() => {
    const filterPendingOrder =  data?.filter((item) => item?.isDelivered === false)
    setOrderData(filterPendingOrder)
  }, [data])

  useEffect(() => {
    setFilteredData(orderData);
  }, [orderData])



  const updateOrderStatus =  async (id: string) => {
    const res =  await update_order_status(id);
    if(res?.success){
      toast.success(res?.message)
      mutate('gettingAllOrdersForAdmin')
    }else{
      toast.error(res?.message)
    }
  }



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
      selector: (row: Order) => row?.totalPrice,
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
        <div>
        <button onClick={() => updateOrderStatus(row?._id)} className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'>Xác nhận</button>
        <button onClick={() => updateOrderStatus(row?._id)} className=' w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700'>Huỷ đơn</button>
        </div>
      )
    },

  ];

  useEffect(() => {
    if (search === '') {
      setFilteredData(orderData);
    } else {
      setFilteredData(orderData?.filter((item) => {
        const itemData = item?._id?.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }))
    }
  }, [search, orderData])



  return (
    <div className='w-full h-full'>
      <DataTable
        columns={columns}
        data={filteredData || []}
        key={'ThisOrdersData'}
        pagination
        keyField="id"
        title={`Danh sách đơn hàng chưa xử lý`}
        fixedHeader
        fixedHeaderScrollHeight='700px'
        selectableRows
        selectableRowsHighlight
        persistTableHead
        subHeader
        subHeaderComponent={
          <input className='w-60 dark:bg-transparent py-2 px-2  outline-none  border-b-2 border-orange-600' type={"search"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Mã đơn"} />
        }
        className="bg-white px-4 h-5/6 "
      />

    </div>
  )
}

