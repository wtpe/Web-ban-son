"use Client"

import React, { useEffect, useState } from 'react'

import { useSWRConfig } from "swr"
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Image from 'next/image';
import Loading from '@/app/loading';
import { useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { delete_a_product } from '@/Services/Admin/product';


type ProductData = {
  _id: string,
  productName: string,
  productNorm: string,
  productDescription: string,
  productImage: string,
  productSlug: string,
  productPrice: Number,
  productWeight: Number,
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


export default function ProductDataTable() {
  const { mutate } = useSWRConfig()
  const router = useRouter();
  const [prodData, setprodData] = useState<ProductData[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.product)
  const isLoading = useSelector((state: RootState) => state.Admin.productLoading);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<ProductData[] | []>([]);


  useEffect(() => {
    setprodData(data)
  }, [data])

  useEffect(() => {
    setFilteredData(prodData);
  }, [prodData])

  const columns = [
    {
      name: 'Tên',
      selector: (row: ProductData) => row?.productName,
      sortable: true ,
      
    },
    {
      name: 'Danh mục',
      selector: (row: ProductData) => row?.productCategory?.categoryName,
      sortable: true ,
      
    },
    {
      name: 'Trọng lượng',
      selector: (row: ProductData) => row?.productWeight.toString(),
      sortable: true ,
      
    },
    {
      name: 'Số lượng',
      selector: (row: ProductData) => row?.productQuantity.toString(),
      sortable: true ,
    },
    {
      name: 'Giá',
      selector: (row: ProductData) => row?.productPrice.toString(),
      sortable: true ,
      
    },
    {
      name: 'Ảnh',
      cell: (row: ProductData) => <Image src={row?.productImage} alt='No Image Found' className='py-2' width={100} height={100} />
      
    },
    {
      name: 'Hành động',
      cell: (row: ProductData) => (
        <div className='flex items-center justify-start px-2 h-20'>
          <button onClick={() => router.push(`/product/update-product/${row?._id}`)} className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'>Sửa</button>
          <button onClick={() => handleDeleteProduct(row?._id)} className=' w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700'>Xoá</button>
        </div>
      )
    },

  ];



  const handleDeleteProduct = async (id: string) => {
    const res = await delete_a_product(id);
    if (res?.success) {
      toast.success(res?.message)
      mutate('/gettingAllProductsFOrAdmin')
    }
    else {
      toast.error(res?.message)
    }
  }


  useEffect(() => {
    if (search === '') {
      setFilteredData(prodData);
    } else {
      setFilteredData(prodData?.filter((item) => {
        const itemData = item?.productCategory?.categoryName.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }))
    }


  }, [search, prodData])



  return (
    <div className='w-full h-full'>
      <DataTable
        
        columns={columns}
        data={filteredData || []}
        key={'ThisProductData'}
        pagination
        keyField="id"
        title={`Danh sách sản phẩm`}
        fixedHeader
        fixedHeaderScrollHeight='500px'
        selectableRows
        selectableRowsHighlight
        persistTableHead
        progressPending={isLoading}
        progressComponent={<Loading />}
        subHeader
        subHeaderComponent={
          <input className='w-60 dark:bg-transparent py-2 px-2  outline-none  border-b-2 border-orange-600' type={"search"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Tên sản phẩm"} />
        }
        className="bg-white px-4 h-4/6 "
      />

    </div>
  )
}

