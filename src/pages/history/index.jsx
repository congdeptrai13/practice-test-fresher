import React, { useEffect, useState } from 'react'
import { Space, Table, Tag } from 'antd';
import { getAllOrder } from '../../services/orderServices';
import ReactJson from 'react-json-view'
import "./historyPage.scss"

const HistoryPage = () => {
  const [dataOrder,setDataOrder] = useState([])
  const columns = [
    {
      title: 'STT',
      dataIndex: '#',
      render: (text, record, index) => <p>{index + 1}</p>
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text,record,index) => <p>{(record?.totalPrice)?.toLocaleString()} ₫</p>
    },
    {
      title: 'Trạng thái',
      render: (text,record,index) => <Tag color={"green"}>
      Thành công
    </Tag>
    },
    {
      title: 'Chi tiết',
      render:(text,record,index)=> <ReactJson src={record?.detail} name="Chi tiết đơn hàng" collapsed={true} enableClipboard={false}/>
    },
  ];
  const data = dataOrder;
  useEffect(()=>{
    getAllOrderHistory()
  },[])
  const getAllOrderHistory = async()=>{
    const res = await getAllOrder()
    setDataOrder(res.data)
  }
  return (
    <div style={{background:"#fff",padding:"10px 48px"}} className='css_historypage'>
      <p>Lịch sử đặt hàng:</p>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default HistoryPage