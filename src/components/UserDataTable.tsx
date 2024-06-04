import { update_user } from '@/Services/Admin/user'
import { RootState } from '@/Store/store'
import Loading from '@/app/loading'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useSWRConfig } from 'swr'

type UserData = {
  _id: string,
  name:string,
  email:string,
  password:string,
  role:string
}

const UserDataTable = () => {
  const { mutate } = useSWRConfig()
  const [userData,setUserData] = useState<UserData[]|[]>([]);
  
  const data = useSelector((state:RootState)=>state.Admin.user) ;
  const isLoading = useSelector((state:RootState)=>state.Admin.userLoading)
  const [search,setSearch]= useState('')
  const [filteredData, setFilteredData] = useState<UserData[] | []>([])
  const [newRole, setNewRole] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setUserData(data)
  }, [data])

  useEffect(() => {
    setFilteredData(userData);
  }, [userData])


  const updateRole =  async (id: string,newRole:string) => {
    const updateData= {
      _id: id,
      role: newRole
    }
    const res = await update_user(updateData);
    if (res?.success) {
      toast.success(res?.message)
      mutate('/gettingAllUsersFOrAdmin')
    }
    else {
      toast.error(res?.message)
    }
  }

  const columns = [
    {
      name:'Họ tên',
      selector:(row:UserData) => row?.name,
      sortable:true
    },
    {
      name:'Email',
      selector:(row:UserData) => row?.email,
      sortable:true
    },
    {
      name:'Mật khẩu',
      selector:(row:UserData) => row?.password,
      sortable:true
    },
    {
      name:'Phân quyền',
      selector:(row:UserData) =>row.role,
      sortable:true,
    },
    {
      name: 'Hành động',
      cell: (row: UserData) => (
        editingId === row._id ? (
          <div>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              name="phân quyền"
            >
              {['user', 'admin'].map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                updateRole(row._id, newRole);
                setEditingId(null);
              }}
            >
              Lưu
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setEditingId(row._id);
              setNewRole(row.role);
            }}
          >
            Sửa
          </button>
        )
      ),
    },
  ]

  useEffect(() => {
    if (search === '') {
      setFilteredData(userData);
    } else {
      setFilteredData(userData?.filter((item) => {
        const itemData = item?.name.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }))
    }
  }, [search, userData])

  return (
    <div className='w-full h-full'>
      <DataTable
      columns={columns}
      data={filteredData|| []}
      key={'userData'}
      pagination
      keyField='id'
      title={'Danh sách người dùng'}
      fixedHeader
      fixedHeaderScrollHeight='700px'
      selectableRows
      selectableRowsHighlight
      persistTableHead
      progressPending={isLoading}
      progressComponent={<Loading/>}
      subHeader
      subHeaderComponent={
        <input className='w-60 dark:bg-transparent py-2 px-2  outline-none  border-b-2 border-orange-600' type={"search"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Tên"} />
      }
      className='bg-white px-4 h-5/6'
      />
    </div>
  )
}

export default UserDataTable
