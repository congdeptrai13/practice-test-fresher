import { DeleteOutlined, SmileOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Radio, Result, Row, Steps, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./orderPage.scss"
import { doRemoveCart, doResetCart, doUpdateQuantityToCart } from '../../redux/order/orderSlice'
import TextArea from 'antd/es/input/TextArea'
import { postCreateOrder } from '../../services/orderServices'
import { useNavigate } from 'react-router-dom'


const OrderPage = (props) => {
  const order = useSelector(state => state.order.carts)
  const navigate = useNavigate()
  const url = import.meta.env.VITE_BACKEND_BASE_URL
  const dispatch = useDispatch();
  const [totalPrice,setTotalPrice] = useState(0);
  const [currentStep,setCurrentStep] = useState(1);
  const [form] = Form.useForm();
  const user = useSelector(state => state.account.user);
  useEffect(()=>{
    let price = 0;
    order?.map((item)=>{
      return price += item?.quantity * item?.details?.price
    })
    setTotalPrice(price)
  },[order])
  const onChange = (value,itemId) => {
    dispatch(doUpdateQuantityToCart({value,itemId}))
  };
  const handleRemoveCart=(id)=>{
    dispatch(doRemoveCart(id))
  }
  const onFinish= async(values)=>{
    const details = [];
    order?.map((item)=>{
      return details.push({
        bookName: item.details.mainText,
        quantity: item.quantity,
        _id: item.id
      })
    })

    const res = await postCreateOrder({
      name: values.name,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail : details
    })
    if(res && res.data){
      setCurrentStep(3)
      dispatch(doResetCart())
    }else{
      message.error(res?.message)
    }
  }
  return (
    <div style={{background: "rgb(245, 245, 245)", padding: "10px 48px",height:"100%"}}>
      <div>
        <Row gutter={30}>
          <Col span={24} style={{display:"flex",justifyContent:"center",alignItems:"center",background:"#fff",padding:"15px",marginBottom:"20px"}}>
            <Steps
              size="small"
              current={currentStep}
              items={[
                {
                  title: 'Đơn hàng',
                },
                {
                  title: 'Đặt hàng',
                },
                {
                  title: 'Thanh toán',
                },
              ]}
            />
          </Col>
          {currentStep !== 3 && <Col lg={16} sm={24}  style={{paddingLeft:"0"}} className='css_step_one'>
            <Row>
              <Col span={24}>
                {order?.map((item)=>{
                  return(
                    <Row style={{display:"flex",justifyContent:"center",alignItems:"center",background:"#fff",padding:"15px",marginBottom:"20px"}}>
                  <Col span={2}>
                  <img src={`${url}/images/book/${item?.details?.thumbnail}`} width={"57px"} height={"50px"}/>
                  </Col>
                  <Col span={8} style={{overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                    {item?.details?.mainText}
                  </Col>
                  <Col span={3} style={{textAlign:"center"}}>
                    {(item?.details?.price)?.toLocaleString()} ₫
                  </Col>
                  <Col span={4}>
                  <InputNumber min={1} max={item?.details?.quantity} defaultValue={item?.quantity} onChange={(value)=> onChange(value,item?.id)} />
                  </Col>
                  <Col span={6} style={{textAlign:"center"}}>
                    Tổng: {((item?.details?.price)*item?.quantity)?.toLocaleString()} ₫
                  </Col>
                  <Col span={1} style={{display:"flex",justifyContent:"flex-end"}}>
                  <DeleteOutlined onClick={()=> handleRemoveCart(item.id)}/>
                  </Col>
                </Row>
                  )
                })}
              </Col>
            </Row>
          </Col>}
          {
            currentStep === 1 &&  <Col lg={8} sm={24} style={{padding:"15px",background:"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <p>Tạm tính</p>
              <p style={{fontWeight:"bold"}}>{(totalPrice)?.toLocaleString()} ₫</p>
              </div>
              <Divider/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p>Tổng tiền</p>
                <p style={{fontSize:"26px",color:"#ee4d2d",fontWeight:"bold"}}>{(totalPrice)?.toLocaleString()} ₫</p>
              </div>
              <Divider/>
              <div style={{display:"block"}}>
                <button className='button-buy' style={{width:"100%",padding:"15px",borderRadius:"5px"}} onClick={()=> setCurrentStep((prev)=> prev + 1)}>Mua Hàng ({order?.length})</button>
              </div>
          </Col>
          }
          {
            currentStep === 2 && 
            <Col lg={8} sm={24} style={{padding:"15px",background:"#fff",height:"100%"}} >
            <Form
            onFinish={onFinish}
            initialValues={
              {
                name: user?.fullName,
                phone: user?.phone,

              }
            }
             form={form}
             layout="vertical"
            >
              <Form.Item 
              label="Tên người nhận"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên người nhận!',

                },
              ]}
              >
                <Input placeholder="Nhập tên người nhận" />
              </Form.Item>
              <Form.Item 
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',

                },
              ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item 
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ!',

                },
              ]}
              >
                <TextArea rows={3} placeholder='Nhập địa chỉ'/>
              </Form.Item>
              <Form.Item 
              label="Hình thức thanh toán"
              >
                     <Radio checked>Thanh toán khi nhận hàng</Radio>
              </Form.Item>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p>Tổng tiền</p>
                <p style={{fontSize:"26px",color:"#ee4d2d",fontWeight:"bold"}}>{(totalPrice)?.toLocaleString()} ₫</p>
              </div>
              <div style={{display:"block",marginTop:"20px"}}>
                <button className='button-buy' style={{width:"100%",padding:"15px",borderRadius:"5px"}} onClick={()=> form.submit()}>Đặt Hàng ({order?.length})</button>
              </div>
            </Form>
          </Col>
          }
          {currentStep === 3 &&
          <Col span={24}>
            <Result
          icon={<SmileOutlined />}
          title="Đơn hàng đã được đặt thành công!"
          extra={<Button type="primary" onClick={()=> navigate("/history")}>Xem lịch sử</Button>}
        />
          </Col>
          }
        </Row>
      </div>
    </div>
  )
}

export default OrderPage