import './globals.css'
import { Poppins } from 'next/font/google'
import { Providers } from '@/Store/Provider'
import 'react-toastify/dist/ReactToastify.css';

const poppin = Poppins({
  weight: ['100', '400'],
  subsets: ['latin'],
})


export const metadata = {
  title: 'Ecommerce',
  description: 'Developed by abc',
  authors: [{ name: "abc", url: '' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 
  return (
    <html lang="en">
      <body className={poppin.className}>
        <Providers>
          {children}
        </Providers>
      </body>

    </html>
  )
}
