import React, { useState } from 'react'
import {  Button, Divider, Form, Input, message } from 'antd';
import "./register.scss"
import { postRegisterUser } from '../../services/userServices';
import { useNavigate } from 'react-router-dom';
const RegisterPage = () => {
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();
  const onFinish = async(values) => {
    setLoading(true);
    const res = await postRegisterUser(values);
    setLoading(false);
    if(res.statusCode === 201){
      navigate('/login');
      return message.success("tạo tài khoản thành công");
    }
   return message.error(res.message);
  };

  return (
    <div className='register_container'>
      <div className='register_wrapper'>
     <div style={{borderRadius:"5px"}}>
     <h3 className='register_title'>Đăng ký người dùng mới</h3>
      <Divider/>
        <Form
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: 'Please input your Full Name!',
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input className='ant-col-24'/>
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Please input your Phone Number!',
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset:8,
              span: 24,
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <p style={{textAlign:"center",marginBottom:"20px"}}>Or</p>
        <p>Đã có tài khoản? <span onClick={()=> navigate("/login")} style={{cursor:"pointer",textDecoration:"underline"}}>Đăng nhập ngay?</span></p>
     </div>
        </div>
    </div>
  )
}

export default RegisterPage