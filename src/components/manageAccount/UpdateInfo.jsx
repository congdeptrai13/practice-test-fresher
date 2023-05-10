import { AntDesignOutlined, UploadOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Form, Input, Row, Upload, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { callUploadAvatarImg, putUpdateInfoUser } from '../../services/userServices'
import { doUploadUserInfoAction } from '../../redux/account/accountSlice'

const UpdateInfo = () => {
  const user = useSelector(state => state.account.user)
  const url = import.meta.env.VITE_BACKEND_BASE_URL
  const [userAvatar,setUserAvatar ] = useState("")
  const [isLoading,setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  useEffect(()=>{
    setUserAvatar(user?.avatar)
  },[])
  const handleUploadAvatar = async({file,onSuccess,onError})=>{
     const res = await callUploadAvatarImg(file);
     if(res && res.data){
      const newAvatar = res.data.fileUploaded;
      setUserAvatar(newAvatar);
      onSuccess("ok")
     }
     else{
      onError("Đã có lỗi xảy ra khi upload file")
     }
  }

  const propsUpload = {
    maxCount: 1,
    multiple:false,
    showUploadList:false,
    customRequest: handleUploadAvatar,
    onChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        message.success(`Upload file thành công`);
      } else if (info.file.status === 'error') {
        message.error(`Upload file thất bại`);
      }
    },
  };

  const onFinish=async(values)=>{
    setIsLoading(true)
    const {phone,fullName} = values
    const res = await putUpdateInfoUser(fullName,phone, userAvatar, user.id)
    if(res && res.data){
      dispatch(doUploadUserInfoAction({avatar: userAvatar,phone,fullName}));
      message.success("cập nhật thông tin user thành công");
      //force renew token
      localStorage.removeItem("access_token");
    }
    setIsLoading(false)
   
  }
  return (
    <Row>
      <Col md={12} sm={24} xs={24} style={{display:"flex", flexDirection:"column",gap:"20px",justifyContent:"center",alignItems:"center"}}>
      <Avatar
    size={{
      xs: 100,
      sm: 100,
      md: 100,
      lg: 100,
      xl: 150,
      xxl: 150,
    }}
    icon={<img src={`${url}/images/avatar/${userAvatar}`}/>}
  />
  
  <Upload {...propsUpload}>
      <Button icon={<UploadOutlined />}>Upload Avatar</Button>
    </Upload>
      </Col>
      <Col md={12} sm={24} xs={24}>
        <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        initialValues={{
          email: user?.email,
          fullName: user?.fullName,
          phone: user?.phone
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
              label="Tên hiện thị"
              name="fullName"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên người nhận!',

                },
              ]}
          >
              <Input placeholder="Nhập tên người nhận"/>
          </Form.Item>
          <Form.Item 
              label="Số điện thoại"
              name="phone"
              required={true}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên người nhận!',

                },
              ]}
          >
              <Input placeholder="Nhập tên người nhận"/>
          </Form.Item>
          <Button onClick={()=> form.submit()} loading={isLoading}>Cập nhật</Button>
        </Form>
      </Col>
    </Row>
  )
}

export default UpdateInfo