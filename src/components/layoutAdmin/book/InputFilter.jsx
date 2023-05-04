import React, { useState } from 'react'
import { Button, Col, Form, Input, message, Row, Space } from 'antd';


const InputFilter = (props) => {
  const [form] = Form.useForm();
  //từ hàm cha chuyền function tên là handlesearch xuống hàm con
  //hàm con xử lý logic sau đó xét diều kiện nếu query không rỗng thì gọi hàm handleSearch chạy
  //sau đó trên hàm cha ta lấy đc biến params gán cho query
  const onFinish = (values) => {
    console.log(values);
    let query = "";
    if(values.mainText){
      query += `&mainText=/${values.mainText}/i`
    }
    if(values.author){
      query += `&author=/${values.author}/i`
    }
    if(values.category){
      query += `&category=/${values.category}/i`
    }
    
    if(query){
      props.handleSearch(query);
    }
  };
  const onFill = () => {
    const query ="";
    form.resetFields();
    props.handleSearch(query);
  };
  return (
    <>
      <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      wrapperCol={{
        span: 24,
      }}
      style={{
        backgroundColor:"#ccc",
        padding:"20px",
        borderRadius:"5px"
      }}
    >
      <Row>
        <Col span={8}>
        <Form.Item
        name="mainText"
        label="Tên sách"
      >
        <Input placeholder="input placeholder" style={{width:"80%"}}/>
      </Form.Item>
        </Col>
        <Col span={8}>
        <Form.Item
        name="author"
        label="Tác giả"
      >
        <Input placeholder="input placeholder"  style={{width:"80%"}}/>
      </Form.Item>
        </Col>
        <Col span={8}>
        <Form.Item
        name="category"
        label="Thể loại"
      >
        <Input placeholder="input placeholder" style={{width:"80%"}}/>
      </Form.Item>
        </Col>
      </Row>
      <Form.Item style={{display:"flex",justifyContent:"flex-end",alignItems:"center"}}>
        <Space>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button htmlType="button" onClick={onFill}>
            Clear
          </Button>
        </Space>
      </Form.Item>
    </Form>
    </>
  )
}

export default InputFilter