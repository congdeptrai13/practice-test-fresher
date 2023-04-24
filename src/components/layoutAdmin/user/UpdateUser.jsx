import { Form, Input, Modal, message } from 'antd';
import React, { useEffect } from 'react'
import { putUpdateUser } from '../../../services/userServices';

const UpdateUser = (props) => {
  const {isModalUpdateOpen, setIsModalUpdateOpen,dataUserUpdate,setDataUserUpdate,getUsersPaginate} = props;
  const onFinishUpdateUser=async(values)=>{
    const res = await putUpdateUser(values);
    if(res && res.data){
      setIsModalUpdateOpen(false);
      message.success("Cập nhật User thành công");
      await getUsersPaginate();
    }else{
      message.error("không thể sửa người dùng");
    }
  }
  const [form] = Form.useForm();
  useEffect(()=>{
    form.setFieldsValue(dataUserUpdate);
  },[dataUserUpdate])
  const handleCancelUpdateUser = () => {
    setDataUserUpdate([]);
    setIsModalUpdateOpen(false);
  };
  return (
    <Modal title="Cập nhật người dùng" open={isModalUpdateOpen} onOk={()=> form.submit(onFinishUpdateUser)} onCancel={handleCancelUpdateUser}>
    <Form
      form={form}
      onFinish={onFinishUpdateUser}
      layout="vertical"
      autoComplete="off"
    >
      
      <Form.Item
      hidden
        name="_id"
        label="id"
        rules={[
          {
            required: true,
            message:"vui lòng nhập full name"
          }
        ]}
      >
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item
      hidden
        name="avatar"
        label="avatar"
        rules={[
          {
            required: true,
            message:"vui lòng nhập full name"
          }
        ]}
      >
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item
        name="fullName"
        label="Tên hiện thị"
        rules={[
          {
            required: true,
            message:"vui lòng nhập full name"
          }
        ]}
      >
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        disabled={"true"}
        rules={[
          {
            
            required: true,
            message:"vui lòng nhập email"
          }
        ]}
      >
        <Input placeholder="input placeholder" disabled={true}/>
      </Form.Item>
      <Form.Item
        name="phone"
        label="Số điện thoại"
        rules={[
          {
            required: true,
            message:"vui lòng nhập phone"
          }
        ]}
      >
        <Input placeholder="input placeholder" />
      </Form.Item>
    </Form>
      </Modal>
  )
}

export default UpdateUser