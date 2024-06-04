import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/Store/store'
import TileContainer from './TileContainer';
import ProductDataTable from './ProductDataTable';
import CategoryDataTable from './CategoryDataTable';
import PendingOrdersDataTable from './PendingOrdersDataTable';
import CompletedOrderDataTable from './CompletedOrderDataTable';
import UserDataTable from './UserDataTable';
import DashboardCharts from './DashboardCharts';

export default function SuperComponent() {
    const navActive = useSelector((state: RootState) => state.AdminNav.ActiveNav)
    switch (navActive) {
        case 'Base':
            return <TileContainer />;
        case 'activeProducts':
            return <ProductDataTable />
        case 'activeCategories':
            return <CategoryDataTable/>
        case 'activeUsers':
            return <UserDataTable/>
        case 'activePendingOrder':
            return <PendingOrdersDataTable/>
        case 'activeDeliveredOrder':
            return <CompletedOrderDataTable/>
        case 'activeStatisTable':
            return <DashboardCharts/>    
        default:
            return <TileContainer />;
    }
}

export const dynamic = 'force-dynamic'