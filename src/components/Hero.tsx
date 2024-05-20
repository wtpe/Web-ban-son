import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface IProps {
  setRatio: (value: number) => void;
}


export default function Hero({setRatio} : IProps) {
  return (
    <div className='w-full h-screen relative'>
      <Image src={'/intro2.jpg'} alt='no Image' fill className="w-full h-full object-fill hidden md:block " onLoadingComplete={({ naturalWidth, naturalHeight }) =>
          setRatio(naturalWidth / naturalHeight)
        } />
      <div className='w-full flex-col md:hidden h-full relative flex items-center px-3 justify-center text-center'>
        <Image src={'/mob-intro1.jpg'} alt='no image'  fill />

        <h1 className='mb-2 text-xl text-cyan-600 z-10 font-bold'></h1>
        <Link href={"/#my-Categories"} className='btn  border-sky-500 text-white/90 hover:bg-orange-600  z-40'>Xem cửa hàng</Link>


      </div>
    </div>
  )
}
