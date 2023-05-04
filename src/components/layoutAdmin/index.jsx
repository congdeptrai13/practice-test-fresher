import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, Space, message, theme } from 'antd';
import { DownOutlined,DashboardOutlined,TeamOutlined } from '@ant-design/icons';
import { Footer } from 'antd/es/layout/layout';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(state=> state.account.user);
  const url = import.meta.env.VITE_BACKEND_BASE_URL
  const avatarUrl = `${url}/images/avatar/${user?.avatar}`;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick = ({ key }) => {
    if(key === "home"){
      navigate("/");
    }
  };
  const items = [
    {
      label: 'Quản lý tài khoản',
      key: '1',
    },
    {
      label: 'Trang chủ',
      key: 'home',
    },
    {
      label: 'Đăng Xuất',
      key: '2',
    },
  ];
  return (
    <>
      <Layout style={{minHeight:"100vh"}}>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed} style={{marginLeft:"20px"}}>
        <div className="logo" style={{textAlign:"center",cursor:"pointer",margin:"6px 0"}} onClick={()=> navigate("/")}>
          <img src='https://salt.tikicdn.com/ts/upload/e4/49/6c/270be9859abd5f5ec5071da65fab0a94.png' height={40} width={57}/>
        </div>
        <Menu
          defaultSelectedKeys={['1']}
          mode='inline'
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: <Link to="/admin">Dashboard</Link>,
            },
            {
              key: 'manageUser',
              icon: <VideoCameraOutlined />,
              label: "Manage Users",
              children:[
                {
                  key:"crud",
                  icon: <TeamOutlined />,
                  label: <Link to="/admin/user">CRUD</Link>,
                },
                {
                  key:"asd",
                  icon: <TeamOutlined />,
                  label: <Link to="/admin/user">CRUD</Link>,
                }
              ]
            },
            {
              key: 'manageBook',
              icon: <UploadOutlined />,
              label: <Link to="/admin/book">Manage Books</Link>,
            },
            {
              key: 'manageOrder',
              icon: <UploadOutlined />,
              label: <Link to="/">Manage Orders</Link>,
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            paddingLeft:"20px",
            background: colorBgContainer,
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          <div>
          {user && user?.fullName
      ?
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <Avatar src={avatarUrl} style={{marginRight:"5px"}}/>
          <Dropdown
            menu={{
              items,
              onClick,
            }}
            style={{cursor:"pointer"}}
          >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Hello {user?.fullName}
              <DownOutlined />
            </Space>
          </a>
          </Dropdown>
        </div>
      :
      <div className='User' onClick={()=> navigate("/login")}>
      <p>
       <UserOutlined style={{fontSize:"24px",color:"inherit",marginRight:"4px"}}/> <span style={{fontSize:"18px",lineHeight:"150%",fontWeight:"400"}}>Tài khoản</span></p>
    </div>
      } 
        </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet/>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    
    </Layout>
    </>
  )
}

export default LayoutAdmin