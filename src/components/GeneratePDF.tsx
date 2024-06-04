import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { RootState } from '@/Store/store';
import autoTable from 'jspdf-autotable';


interface userData {
  email: string;
  role: string;
  _id: string;
  name: string;
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


export default function GeneratePDF({ orderData1 }: {orderData1?: Order}) {
    
  const user = useSelector((state: RootState) => state.User.userData) as userData | null;

  useEffect(() => {
    if (orderData1) {
      generatePDFInvoice(orderData1);
    }
  }, [orderData1]);

  const generatePDFInvoice = (order: Order) => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.text('Hoa don', 20, 20);

    // Add order details
    doc.setFontSize(12);
    doc.text(`Ma hoa don: ${order?._id ?? 'N/A'}`, 20, 30);
    doc.text(`Ngay dat hang: ${new Date(order?.createdAt ?? '').toLocaleDateString()}`, 20, 40);
    doc.text(`Ten nguoi nhan: ${order?.shippingAddress.fullName ?? 'N/A'}`, 20, 50);
    doc.text(`Dia chi ship: ${order?.shippingAddress.address ?? 'N/A'}`, 20, 60);
    doc.text(`sdt: ${order?.shippingAddress.phone ?? 'N/A'}`, 20, 70);
    doc.text(`Tong gia: ${(order?.totalPrice ?? 0).toLocaleString()}`, 20, 80);

    // Add order items
    autoTable(doc, {
      startY: 90,
      head: [['Tên', 'So luong', 'Giá','Trong luong (kg)']],
      body: order?.orderItems?.map((item) => [
        item.product.productName,
        item.qty,
        item.product.productPrice.toLocaleString(),
        item.product.productWeight 
      ]) ?? [],
    });

    // Save the PDF
    doc.save(`invoice-${order?._id ?? 'unknown'}.pdf`);
  };

  return null;
}