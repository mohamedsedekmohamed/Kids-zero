import React, { useMemo } from 'react'
import useGet from '@/hooks/useGet'
import ReusableTable from '@/Components/UI/ReusableTable'
import Loading from '@/Components/Loading'
import useDelete from '@/hooks/useDelete'
const AddAdmins = () => {
  const { data: getAdmins,  loading: loadingAdmin,  error: errorAdmin  , refetch  } = useGet("/api/admin/admins")
const {deleteData:deleteAdmin,loading:loadingDeleteAdmin,error}=
useDelete("/api/admin/admins/${id}")
  const tabledata=getAdmins
  return (
    <div>AddAdmins</div>
  )
}

export default AddAdmins