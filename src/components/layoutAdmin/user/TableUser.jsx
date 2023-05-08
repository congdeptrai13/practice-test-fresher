import React, { useEffect, useState } from 'react'
import InputFilter from './InputFilter'
import { Button, Table,Drawer, Descriptions, Badge,Modal, Form, Input, message,Popover, Popconfirm } from 'antd';
import { deleteUser, getUsersWithPaginate, postCreateUser } from '../../../services/userServices';
import moment from 'moment';
import {
  ExportOutlined,
  ImportOutlined,
  UserAddOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleFilled
} from '@ant-design/icons';
import ImportUser from './ImportUser';
import * as XLSX from "xlsx";
import { useForm } from 'antd/es/form/Form';
import UpdateUser from './UpdateUser';


const TableUser = () => {
  const [current,setCurrent] = useState(1);
  const [pageSize,setPageSize] = useState(5);
  const [listUsers,setListUsers] = useState([]);
  const [totalUsers,setTotalUsers] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [sorterBy,setSorterBy] = useState("");
  const [detailsUser,setDetailsUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImportOpen,setIsModalImportOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUserUpdate,setDataUserUpdate] = useState([]);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    getUsersPaginate();
  },[current,pageSize,sorterBy])
  const getUsersPaginate = async(query)=>{
    setIsLoading(true);
    const res = await getUsersWithPaginate(current,pageSize,query,sorterBy);
    setIsLoading(false);
    if(res && res?.data){
      setListUsers(res?.data?.result);
      setTotalUsers(res?.data?.meta?.total);
    }
  }

  const handleSearchUser = (query)=>{
    getUsersPaginate(query)
  }
  const handleViewUserDetails=async(user)=>{
    setDetailsUser(user);
    showDrawer();
  }
  const columns = [
    {
      title: 'ID',
      dataIndex:'_id',
      render: (_, record) => (
        <a onClick={() => handleViewUserDetails(record)}>{record._id}</a>
      ),      sorter: {
        multiple: 4,
      },
    },
    {
      title: 'Tên hiện thị',
      dataIndex: 'fullName',
      sorter: {
        multiple: 3,
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: {
        multiple: 2,
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      sorter: {
        multiple: 1,
      },
    },
    {
      title: 'Action',
      render: (_, record) => (
        <div style={{display:"flex",gap:"30px",justifyContent:"center",alignItems:"center"}}>
          <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    okText="Xác nhận"
    cancelText="Hủy"
    placement="leftTop"
    onConfirm={()=>confirmDeleteUser(record)}
  >
          <DeleteOutlined style={{fontSize:"20px",cursor:"pointer",color:"orange"}}/>
          </Popconfirm>
       
        <EditOutlined style={{fontSize:"20px",cursor:"pointer",color:"orange"}} onClick={()=> handleUpdateUser(record)}/>
        </div>
      ),
    },
  ];
  const confirmDeleteUser=async(user)=>{
    const res = await deleteUser(user._id);
    if(res && res.data){
      message.success("Xóa user thành công");
      await getUsersPaginate();
    }else{
      message.error(res.message);
    }
  }
  const handleUpdateUser=(dataUser)=>{
    setDataUserUpdate(dataUser);
    setIsModalUpdateOpen(true);
  }
  const onChange = (pagination,filters, sorter, extra) => {
    if(sorter.order === "ascend"){
      setSorterBy(`-${sorter.field}`);
    }
    if(sorter.order === "descend"){
      setSorterBy(`${sorter.field}`);
    }
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleReloadTable=()=>{
    setSorterBy("");
  }

  const handleExportUser=()=>{
    const worksheet = XLSX.utils.json_to_sheet(listUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "exportUser.csv");
  }
  const renderHeader= ()=>{
    return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <h5>Table List Users</h5>
      <div style={{display:"flex",gap:"15px"}}>
        <Button type="primary" onClick={handleExportUser}>
        <ExportOutlined />
        Export
        </Button>
        {/* <ImportUser/> */}
        <Button type="primary" onClick={()=> setIsModalImportOpen(true)}>
        <ImportOutlined/>
        Import
        </Button>
        <Button type="primary" onClick={showModal}>
        <UserAddOutlined />
        Thêm mới
        </Button>
        <Button style={{border:"none"}} onClick={handleReloadTable}>
        <ReloadOutlined />
        </Button>
      </div>
    </div>
  }
  
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async(values) => {
    const res = await postCreateUser(values);
    if(res && res.data){
      message.success("tạo mới người dùng thành công");
      form.resetFields();
      setIsModalOpen(false);
    }else{
      message.error(res.message);
    }
  };

 
  return (
    <>
      <InputFilter handleSearch={handleSearchUser}/>
      <div style={{marginTop:"20px",height:"100%"}}>
      <Table columns={columns} dataSource={listUsers} onChange={onChange} loading={isLoading}
        pagination={{ total:`${totalUsers}`,defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['1', '5', '10'],
        showTotal: (total, range) => { return(
          <div>{range[0]}-{range[1]} of {total} items</div>
        )
      }
      }}
        title={renderHeader}
      />
      </div>
      <Drawer title="Chức năng xem chi tiết" placement="right" onClose={onClose} open={open} width="50vw">
      <Descriptions title="Thông tin người dùng" bordered>
    <Descriptions.Item label="ID" span={1}>{detailsUser?._id}</Descriptions.Item>
    <Descriptions.Item label="Tên hiển thị" span={2}>{detailsUser?.fullName}</Descriptions.Item>
    <Descriptions.Item label="Email"span={1}>{detailsUser?.email}</Descriptions.Item>
    <Descriptions.Item label="Số điện thoại"span={2}>{detailsUser?.phone}</Descriptions.Item>
    <Descriptions.Item label="Role" span={3}>
      <Badge status="processing" text={detailsUser?.role} />
    </Descriptions.Item>
    <Descriptions.Item label="Created At">{moment(detailsUser?.createdAt).format()}</Descriptions.Item>
    <Descriptions.Item label="Updated At">{moment(detailsUser?.updatedAt).format()}</Descriptions.Item>
  </Descriptions>
      </Drawer>

      <Modal title="Thêm mới người dùng" open={isModalOpen} onOk={()=> form.submit()} onCancel={handleCancel} cancelText={"Hủy"} okText={"Thêm mới"} >
      <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
    >
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
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message:"vui lòng nhập password"
          }
        ]}
      >
        <Input.Password placeholder="input placeholder" />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
            message:"vui lòng nhập email"
          }
        ]}
      >
        <Input placeholder="input placeholder" />
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
    <ImportUser isModalImportOpen={isModalImportOpen} setIsModalImportOpen={setIsModalImportOpen}/>
    <UpdateUser isModalUpdateOpen={isModalUpdateOpen} setIsModalUpdateOpen={setIsModalUpdateOpen} dataUserUpdate={dataUserUpdate} setDataUserUpdate={setDataUserUpdate} getUsersPaginate={getUsersPaginate}/>
    </>
  )
}

export default TableUser