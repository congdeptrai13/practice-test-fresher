import React, { useEffect, useState } from 'react'
import InputFilter from './InputFilter'
import { Button, Table,Drawer, Descriptions, Badge } from 'antd';
import { getUsersWithPaginate } from '../../../services/userServices';
import moment from 'moment';
import {
  ExportOutlined,
  ImportOutlined,
  UserAddOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const TableUser = () => {
  const [current,setCurrent] = useState(1);
  const [pageSize,setPageSize] = useState(5);
  const [listUsers,setListUsers] = useState([]);
  const [totalUsers,setTotalUsers] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [sorterBy,setSorterBy] = useState("");
  const [detailsUser,setDetailsUser] = useState([]);

  const [open, setOpen] = useState(false);

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
    console.log(res);
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
        <Button onClick={() => handleDelete(record._id)} key={`delete-${record._id}`} style={{textAlign:"center"}}>Delete</Button>
      ),
    },
  ];
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

  const renderHeader= ()=>{
    return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <h5>Table List Users</h5>
      <div style={{display:"flex",gap:"15px"}}>
        <Button type="primary">
        <ExportOutlined />
        Export
        </Button>
        <Button type="primary">
        <ImportOutlined />
        Import
        </Button>
        <Button type="primary">
        <UserAddOutlined />
        Thêm mới
        </Button>
        <Button style={{border:"none"}} onClick={handleReloadTable}>
        <ReloadOutlined />
        </Button>

      </div>
    </div>
  }
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
    </>
  )
}

export default TableUser