import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/layout/sidebar"; // Import Sidebar component
import { Outlet } from "react-router-dom";
import axios from '../src/util/axios.customize';
import { AuthContext } from "./components/context/auth.context";
import { Layout, Spin } from "antd";

const { Content } = Layout;

const App = () => {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(true); // Bắt đầu ở trạng thái thu gọn

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      const res = await axios.get(`/users/account`);

      if (res && !res.message) {
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.email,
            name: res.name,
            _id: res._id,
            role: res.role,
            usersID: res.usersID
          }
        });
      }
      setAppLoading(false);
    };

    fetchAccount();
  }, []);

  const handleMouseEnter = () => {
    setCollapsed(false); // Mở rộng Sidebar khi di chuột vào
  };

  const handleMouseLeave = () => {
    setCollapsed(true); // Thu gọn Sidebar khi di chuột ra ngoài
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {appLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Sidebar
            collapsed={collapsed}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Layout className="site-layout">
            <Content style={{ background: '#fff' }}>
              <Outlet />
            </Content>
          </Layout>
        </>
      )}
    </Layout>
  );
};

export default App;
