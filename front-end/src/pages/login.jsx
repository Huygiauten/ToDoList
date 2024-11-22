import React, { useContext } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { loginUserApi } from '../util/api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import '../styles/login.css';  // Thêm file CSS riêng cho login

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { username, password } = values;
        const response = await loginUserApi(username, password);

        if (response && response.EC === 0) {
            localStorage.setItem("access_token", response.access_token);
            notification.success({
                message: "LOGIN USER",
                description: "Success",
                duration: 2,
            });
            setAuth({
                isAuthenticated: true,
                user: {
                    email: response?.user?.email ?? "",
                    name: response?.user?.name ?? "",
                    _id: response.user._id,
                    role: response?.user?.role ?? "",
                    usersID: response?.user?.usersID ?? ""
                }
            });
            navigate("/note");
        } else {
            notification.error({
                message: "LOGIN USER",
                description: response?.EM ?? "Error",
                duration: 2,
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Đăng nhập</h2>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Mật khẩu" />
                    </Form.Item>

                    {/* Thay thế Checkbox "Nhớ mật khẩu" bằng liên kết đăng ký */}
                    <Form.Item>
                        <span>Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></span>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-button">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
