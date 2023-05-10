import { Card, Col, Row, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import { getAllDashboard } from '../../services/userServices'
import CountUp from 'react-countup';
import "./adminPage.scss"
const AdminPage = () => {
  const [dataDashboard,setDataDashboard] = useState([]);

  useEffect(()=>{
    fetchDashboard()
  },[])
  const formatter = (value) => <CountUp end={value} separator="," />;

  const fetchDashboard = async()=>{
    const res = await getAllDashboard()
    if(res && res.data){
      setDataDashboard(res.data);
    }
  }
  return (
    <Row gutter={10}>
      <Col xl={12} sm={24}  style={{marginBottom:"20px"}}>
      <Card
    bordered={false}
    className='card_info'
    style={{
      width: 500,
    }}
  >
    <Statistic title="Tổng user" value={dataDashboard?.countUser} formatter={formatter} />
  </Card>
  </Col>
  <Col xl={12} sm={24} >
      <Card
       className='card_info'
    bordered={false}
    style={{
      width: 500,
    }}
  >
    <Statistic title="Tổng đơn hàng" value={dataDashboard?.countOrder} formatter={formatter} />
  </Card>
  </Col>
  </Row>
  )
}

export default AdminPage