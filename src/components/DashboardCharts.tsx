import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/Store/store';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

type Product= {
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

const DashboardCharts: React.FC = () => {
  const [monthlyRevenueOptions, setMonthlyRevenueOptions] = useState<ApexOptions>({});
  const [topProductsOptions, setTopProductsOptions] = useState<ApexOptions>({});
  const [order, setOrder] = useState<Order[] | []>([]);
  const [product, setProduct] = useState<Product[] | []>([]);
  const dispatch = useDispatch();
  const productData = useSelector((state: RootState) => state.Admin.product);
  const orderData = useSelector((state: RootState) => state.Admin.Order);


  useEffect(() => {
    setOrder(orderData)
  }, [orderData])
  console.log('orderData:',orderData)
  useEffect(() => {
    setProduct(productData)
  }, [productData])
  //
  useEffect(() => {
    // Group orders by month and year, calculate total revenue for each month
    const monthlyRevenue: { [key: string]: number } = {};
    order.forEach((o) => {
      const date = new Date(o.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      if (!monthlyRevenue[key]) {
        monthlyRevenue[key] = 0;
      }
      monthlyRevenue[key] += o.totalPrice;
      
    });
    const labels = Object.keys(monthlyRevenue);
    const series = Object.values(monthlyRevenue);

    setMonthlyRevenueOptions({
      chart: {
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: labels,
      },
      yaxis: {
        title: {
          text: 'Doanh thu (VND)',
        },
        min:0,
        max:100000000,
        labels: {
          formatter: function(value) {
            return value.toLocaleString(); // Làm tròn về số nguyên
          }
        }
      },
      series: [
        {
          name: 'Doanh thu',
          data: series,
        },
      ],
    });
  }, [order]);

  useEffect(() => {
    // Calculate top selling products
    const productSales: { [key: string]: number } = {};
    const order1= order.filter(e=>e.isDelivered ===('Hoàn thành'));
    order1.forEach((o) => {
      o.orderItems.forEach((item) => {
        if (!productSales[item.product._id]) {
          productSales[item.product._id] = 0;
        }
        productSales[item.product._id] += item.qty;
      });
    });

    const sortedProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id]) => {
        const p = product.find((p) => p._id === id);
        return p ? p.productName : '';
      });

    const series = Object.values(productSales).slice(0, 10);

    setTopProductsOptions({
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: sortedProducts,
      },
      yaxis: {
        title: {
          text: 'Số lượng',
        },
        min:0,
        max:50,
      },
      series: [
        {
          name: 'Số lượng bán',
          data: series,
        },
      ],
    });
  }, [order, product]);
//
  return (
    <div className="grid grid-rows-2 gap-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Doanh thu hàng tháng</h2>
        <ReactApexChart
          options={monthlyRevenueOptions}
          series={monthlyRevenueOptions.series || []}
          type="line"
          height={350}
          width={900}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Sản phẩm bán chạy</h2>
        <ReactApexChart
          options={topProductsOptions}
          series={topProductsOptions.series || []}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default DashboardCharts;