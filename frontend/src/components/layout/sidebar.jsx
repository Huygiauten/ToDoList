import { HomeOutlined, SettingOutlined, FormOutlined, UserOutlined, TeamOutlined  } from '@ant-design/icons';
import { Layout, Menu, Tooltip } from 'antd';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import './sidebar.css'; // Import CSS

const { Sider } = Layout;

const Sidebar = ({ collapsed, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  const items = [
    {
      label: collapsed ? null : <Link to={"/"}>Home Page</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    ...(auth.isAuthenticated ? [
      ...(auth.user.role === "admin" ? [
      {
        label: collapsed ? null : <Link to={"/group"}>Groups</Link>,  
        key: 'group',
        icon: < TeamOutlined/>, 
      },] : []),
      {
        label: collapsed ? null : <Link to={"/note"}>Notes</Link>,
        key: 'note',
        icon: <FormOutlined />,
      },
    ] : []),
    {
      label: collapsed ? null : (
        <Tooltip title={`${auth?.user?.name ?? ""} (ID: ${auth?.user?.usersID ?? ""})`}>
          <span>
            Welcome <span className="sidebar-username">{auth?.user?.name ?? ""}</span>
          </span>
        </Tooltip>
      ),
      key: 'SubMenu',
      icon: <SettingOutlined />,
      children: [
        ...(auth.isAuthenticated ? [
          {
            label: <span onClick={() => {
              localStorage.removeItem("access_token");
              setAuth({
                isAuthenticated: false,
                user: {
                  email: "",
                  name: "",
                  _id: "",
                  role: "",
                  userID: ""
                },
              });
              navigate("/");
            }}>Đăng xuất</span>,
            key: 'logout',
          }
        ] : [
          {
            label: <Link to={"/login"}>Đăng nhập</Link>,
            key: 'login',
          },
          {
            label: <Link to={"/register"}>Đăng ký</Link>,
            key: 'register',
          },
        ]),
      ],
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={200}
      collapsedWidth={80}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ background: '#f4f4f4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      className={collapsed ? 'collapsed' : ''}
    >
      <Menu
        mode="inline"
        items={items}
        style={{ height: '100%', borderRight: 0 }}
      />

      {/* Footer for Sidebar */}
      <div className="sidebar-footer">
        Created by Group 25
      </div>
    </Sider>
  );
};

export default Sidebar;
