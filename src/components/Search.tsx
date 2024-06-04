
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React,{useState} from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa';


  

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

export default function Search()  {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [resultArr,setResultArr] = useState<ProductData[] | []>([]);


  const getResult = async (query: string) => {
    try {
      const response = await fetch(`/api/search?query=${query}`);
      const data = await response.json();
      setResultArr(data.data);
    } catch (error) {
      console.log("Lỗi tìm kiếm sản phẩm", error);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResultArr([]);
  }

  return (
    <div className='w-[500px] relative'>
      <div className='relative'>
        <input className="text-black input w-96 "
          type="text"
          name="search" id="search"
          onChange={(e)=>setQuery(e.target.value)} 
          value={query}
          placeholder="Tìm kiếm ..."/>
        <button className="btn " onClick={() => getResult(query)} ><FaSearch className="text-white text-xl"/></button>
        {resultArr.length > 0 && (
          <button className="btn absolute right-0" onClick={clearSearch}>
            <FaTimes className="text-white text-xl" />
          </button>
        )}
      </div>
      

      {resultArr.length > 0 &&(

        <div className=' absolute top-16 bg-white text-black flex flex-col p-2 gap-2 w-96'>
          {resultArr?.map((item: ProductData) => (
          <>
            <div className='grid grid-cols-2'>
          
            <div onClick={() => router.push(`/product/product-detail/${item._id}`)} className=' rounded relative h-28'>
              <Image src={item.productImage } alt='no Image' className='rounded' fill />
            </div>
          

            <div className="">
              <h3 className="card-title" onClick={() => router.push(`/product/product-detail/${item._id}`)}>{item.productName} </h3>
              <p className='font-semibold' onClick={() => router.push(`/product/product-detail/${item._id}`)}>{`Giá: ${item.productPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })} `}</p>
              <p className='font-semibold' onClick={() => router.push(`/product/product-detail/${item._id}`)}>{`Trọng lượng: ${item.productWeight} kg`}</p>
            </div>
          </div>
          </>
        ))}

        </div>

      )}

        
    </div>
    
  )
}

