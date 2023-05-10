import { Button, Form, Input, message } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { postChangePasswordUser } from '../../services/userServices'

const UpdatePassword = () => {
  const [form] = Form.useForm()
  const user = useSelector(state=> state.account.user);
  const [isLoading,setIsLoading] = useState(false);

  const onFinish =async(values)=>{
    setIsLoading(true);
    const {email,oldpass,newpass} = values
    const res = await postChangePasswordUser(email,oldpass,newpass)
    if(res && res.statusCode === 201){
      message.success("đổi mật khẩu thành công")
      form.resetFields(["oldpass","newpass"])
    }else{
      message.error(res.message)
    }
    setIsLoading(false);
  }
  return (
    <Form
    form={form}
    onFinish={onFinish}
    layout='vertical'
    initialValues={{
      email: user?.email,
      
    }}
    >
      <Form.Item 
          label="Email"
          name="email"
          required={true}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên người nhận!',

            },
          ]}
      >
          <Input placeholder="Nhập tên người nhận" disabled={true}/>
      </Form.Item>
      <Form.Item 
          label="Mật khẩu hiện tại"
          name="oldpass"
          required={true}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu hiện tại!',

            },
          ]}
      >
          <Input.Password placeholder="Nhập mật khẩu hiện tại"/>
      </Form.Item>
      <Form.Item 
          label="Mật khẩu mới"
          name="newpass"
          required={true}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu mới!',

            },
          ]}
      >
          <Input.Password placeholder="Nhập mật khẩu mới"/>
      </Form.Item>
      <Button onClick={()=> form.submit()} loading={isLoading}>Xác nhận</Button>
    </Form>
  )
}

export default UpdatePassword