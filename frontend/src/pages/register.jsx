import { Form, Input, Button, notification, Radio  } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../components/context/auth.context';
import { createUserApi } from '../util/api';  // Đảm bảo rằng API này tồn tại
import '../styles/register.css';

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { username, email, password, role } = values;
        console.log(role);
        // Gọi API để đăng ký người dùng
        const response = await createUserApi(username, email, password, role);

        if (response) {
            notification.success({
                message: "REGISTER USER",
                description: "Đăng ký thành công!",
                duration: 2,
            });

            // Điều hướng đến trang chính sau khi đăng ký thành công
            navigate("/");
        } else {
            notification.error({
                message: "REGISTER USER",
                description: response?.EM ?? "Đã có lỗi xảy ra!",
                duration: 2,
            });
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>Đăng ký tài khoản</h2>
                <Form
                    name="register"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                    >
                        <Input placeholder="Họ và tên" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email hợp lệ!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        rules={[{ required: true, message: 'Vui lòng chọn ít nhất một vai trò!' }]}
                    >
                        <Radio.Group>
                            <Radio value="admin">Admin</Radio>
                            <Radio value="user">User</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-button">
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
