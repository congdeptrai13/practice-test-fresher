import React from 'react'
import { Input ,Col, Row, Avatar} from 'antd';
import "./header.scss"
import { UserOutlined,ShoppingCartOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { postLogoutUser } from '../../services/userServices';
import { doLogoutAction } from '../../redux/account/accountSlice';
const Header = () => {
  const url = import.meta.env.VITE_BACKEND_BASE_URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state=> state.account.user);
  const avatarUrl = `${url}/images/avatar/${user?.avatar}`;
  console.log(avatarUrl)
  const onClick = async({ key }) => {
    if(key === "logout"){
      const res = await postLogoutUser();
      if(res){
        dispatch(doLogoutAction());
        navigate("/");
        return message.success("Đăng xuất thành công");
      }
    }
    if(key === "admin"){
      navigate("/admin");
    }
  };
  const items = [
    {
      label: 'Quản lý tài khoản',
      key: '1',
    },
    {
      label: 'Đăng Xuất',
      key: 'logout',
    },
  ];
  if(user.role === "ADMIN"){
    items.unshift({
      label: 'Quản trị',
      key: 'admin',
    })
  }
  return (
    <div className='container'>
      <div className="wrapper">
      <Row
      gutter={{
        xs: 8,
        sm: 16,
        md: 24,
        lg: 32,
      }}
    >
      <Col className="gutter-row" span={2}>
        <div style={{cursor:"pointer"}} onClick={()=> navigate('/')}>
        <img src='https://salt.tikicdn.com/ts/upload/e4/49/6c/270be9859abd5f5ec5071da65fab0a94.png' width={57} height={40}/>
        </div>
      </Col>
      <Col className="gutter-row" span={14}>
        <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
        <Space.Compact style={{width:"100%"}} size='large'>
          <Input value="" placeholder='Bạn tìm gì hôm nay' />
       </Space.Compact>
        </div>
      </Col>
      <Col className="gutter-row" span={8}>
        <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{position:"relative"}}>
      <ShoppingCartOutlined style={{fontSize:"24px",color:"#136CFF"}}/>
      <span style={{fontSize:"12px",position:"absolute",top:-10,left:15,backgroundColor:"rgb(255, 66, 79)",borderRadius:"100%",color:"#fff",fontWeight:"500",padding:"1px 2px",textAlign:"center"}}>0</span>
      </div>
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
      </Col>
    </Row>
      </div>
    </div>
  )
}

export default Header