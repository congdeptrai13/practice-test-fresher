import { Col, Row, Skeleton } from 'antd'
import React from 'react'

const BookDetailsSkeleton = () => {
  return (
    <>
    <Row gutter={20} style={{backgroundColor:"#fff",height:"80vh"}}>
      <Col span={10} style={{padding:"15px"}}>
        <Skeleton.Avatar shape={"square"} style={{height:"300px",width:"550px"}}/>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px",marginTop:"10px"}}>
          <Skeleton.Image active/>
          <Skeleton.Image active/>
          <Skeleton.Image active/>
        </div>
      </Col>
      <Col span={14} style={{padding:"35px"}}>
      <Skeleton active={true}/>
      <br/>
      <br/>
      <Skeleton active={true} paragraph={{rows:"2"}}/>
      <br/>
      <br/>
      <Skeleton.Button style={{width:"100px",marginRight:"20px"}} active={true}/>
      <Skeleton.Button style={{width:"100px"}} active={true}/>
      </Col>
    </Row>
    </>
  )
}

export default BookDetailsSkeleton