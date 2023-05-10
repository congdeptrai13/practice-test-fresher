import { Modal, Tabs } from 'antd'
import React from 'react'
import UpdateInfo from './UpdateInfo';
import UpdatePassword from './UpdatePassword';

const ManageAccount = (props) => {

  const items = [
    {
      key: '1',
      label: `Cập nhật thông tin`,
      children: <UpdateInfo/>,
    },
    {
      key: '2',
      label: `Đổi mật khẩu`,
      children: <UpdatePassword/>,
    },
  ];
  const {isModalOpen,setIsModalOpen} = props;
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <Modal title="Quản lý tài khoản" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={"70vw"} footer={null}>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
  )
}

export default ManageAccount