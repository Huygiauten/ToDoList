import { CrownOutlined } from "@ant-design/icons";
import { Result, Button } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../components/context/auth.context';
import '../styles/Home.css';  // Import file CSS riêng

const HomePage = () => {
    const navigate = useNavigate();

    const { auth } = useContext(AuthContext)  // Lấy trạng thái đăng nhập từ context

    const handleNavigate = () => {
        if (auth?.isAuthenticated) {
            // Nếu đã đăng nhập, điều hướng đến trang ghi chú
            navigate('/note');
        } else {
            // Nếu chưa đăng nhập, điều hướng đến trang login
            navigate('/login');
        }
    };

    return (
        <div className="home-container">
            <div className="banner">
                <Result
                    icon={<CrownOutlined style={{ color: '#fff', fontSize: '64px' }} />}  // Biểu tượng lớn hơn và màu sắc sáng hơn
                    title="TO DO LIST"
                    subTitle="Quản lý công việc hàng ngày của bạn một cách hiệu quả."
                    extra={
                        <Button type="primary" size="large" onClick={handleNavigate}>
                            Bắt đầu ngay
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

export default HomePage;
