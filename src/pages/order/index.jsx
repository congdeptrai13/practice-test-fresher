import { DeleteOutlined } from '@ant-design/icons'
import { Col, Divider, InputNumber, Row } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import "./OrderPage.scss"

const OrderPage = (props) => {
  const order = useSelector(state => state.order.carts)
  const url = import.meta.env.VITE_BACKEND_BASE_URL
  console.log("order",order)
  const onChange = (value) => {
    console.log('changed', value);
  };
  return (
    <div style={{background: "rgb(245, 245, 245)", padding: "10px 48px"}}>
      <div>
        <Row gutter={30}>
          <Col span={18}>
            <Row>
              <Col span={24} style={{background:"#fff",padding:"15px"}}>
                {order?.map((item)=>{
                  return(
                    <Row style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                  <Col span={2}>
                  <img src={`${url}/images/book/${item?.details.thumbnail}`} width={"57px"} height={"50px"}/>
                  </Col>
                  <Col span={8} style={{overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                    {item?.details.mainText}
                  </Col>
                  <Col span={3}>
                    {(item?.details.price).toLocaleString()} ₫
                  </Col>
                  <Col span={4}>
                  <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
                  </Col>
                  <Col span={6} style={{textAlign:"center"}}>
                    Tổng: {((item?.details.price)*item?.quantity).toLocaleString()} ₫
                  </Col>
                  <Col span={1} style={{display:"flex",justifyContent:"flex-end"}}>
                  <DeleteOutlined/>
                  </Col>
                </Row>
                  )
                })}
              </Col>
            </Row>
          </Col>
          <Col span={6} style={{padding:"15px",background:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p>Tạm tính</p>
              <p>{(100000).toLocaleString()} ₫</p>
              </div>
              <Divider/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p>Tổng tiền</p>
                <p style={{fontSize:"28px",color:"#ee4d2d",fontWeight:"bold"}}>{(100000).toLocaleString()} ₫</p>
              </div>
              <Divider/>
              <div style={{display:"block"}}>
                <button className='button-buy' style={{width:"100%",padding:"15px",borderRadius:"5px"}}>Mua Hàng ({order?.length})</button>
              </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default OrderPage