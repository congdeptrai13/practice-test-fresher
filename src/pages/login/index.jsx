import React, { useState } from 'react'
import {  Button, Divider, Form, Input, message } from 'antd';
import { postLoginUser } from '../../services/userServices';
import "./login.scss"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';
const LoginPage = (props)=>{
  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async(values) => {
    setLoading(true);
    const res = await postLoginUser(values);
    setLoading(false);
    if(res.statusCode === 201){
      localStorage.setItem("access_token",res.data.access_token);
      dispatch(doLoginAction(res.data))
      navigate('/');
      return message.success("Đăng nhập thành công");
    }
   return message.error(res.message);
  };
return (
  <div className='register_container'>
    <div className='register_wrapper'>
   <div style={{borderRadius:"5px"}}>
   <h3 className='register_title'>Đăng nhập</h3>
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
          label="Email"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
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
          wrapperCol={{
            offset:8,
            span: 24,
          }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <p style={{textAlign:"center",marginBottom:"20px"}}>Or</p>
      <p>Chưa có tài khoản? <span onClick={()=> navigate("/register")} style={{cursor:"pointer",textDecoration:"underline"}}>Đăng ký ngay?</span></p>
   </div>
      </div>
  </div>
)
}

export default LoginPage;