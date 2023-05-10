import React, { useEffect, useState } from 'react'
import { Space, Table, Tag } from 'antd';
import { getListOrderWithPaginate } from '../../../services/orderServices';
import "./tableOrder.scss"
const TableOrder = () => {
  const [listOrder,setListOrder] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  useEffect(()=>{
    getAllListOrder()
  },[])
  const getAllListOrder= async()=>{
    setIsLoading(true)
    const res = await getListOrderWithPaginate()
    if(res && res.data){
      setListOrder(res.data.result);
    }
    setIsLoading(false)
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'totalPrice',
      render:(text,record,index) => <p>{(record?.totalPrice).toLocaleString()} ₫</p>
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
    },
  ];
  const data = listOrder
  return (
    <div className='setwidth_table_order'>
      <p>Table List Order</p>
      <Table columns={columns} dataSource={data} loading={isLoading}/>
    </div>
  )
}

export default TableOrder