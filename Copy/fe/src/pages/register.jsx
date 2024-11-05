// import React from 'react';
// import { Button, Form, Input, notification } from 'antd';
// import { createUserApi } from '../util/api';
// import { useNavigate } from 'react-router-dom';

// const registerPage = () => {
//     const navigate = useNavigate();

//     const onFinish = async (values) => {

//         const {name, email, password} = values;

//         const response = await createUserApi(name, email, password);

//         if(response.status == 409){
//             notification.error({
//                 message: "User Existed",
//             });
//         }else{
//             if(response){
//                 notification.success({
//                     message: "CREATE USER",
//                     description: "Success",
//                 });
//                 navigate("/login");
//             }else{
//                 notification.error({
//                     message: "CREATE USER",
//                     description: "Error",
//                 });
//             }
//         }
//     };

//     return (
//         <div style={{ margin: 50 }}>
//             <Form
//                 name="basic"
//                 labelCol={{
//                     span: 8,
//                 }}
//                 wrapperCol={{
//                     span: 16,
//                 }}
//                 style={{
//                     maxWidth: 600,
//                 }}

//                 onFinish={onFinish}
//                 autoComplete="off"
//                 layout='vertical'
//             >
//                 <Form.Item
//                     label="Name"
//                     name="name"
//                     rules={[
//                         {
//                             required: true,
//                             message: 'Please input your name!',
//                         },
//                     ]}
//                 >
//                     <Input />
//                 </Form.Item>

//                 <Form.Item
//                     label="Email"
//                     name="email"
//                     rules={[
//                         {
//                             required: true,
//                             message: 'Please input your email!',
//                         },
//                     ]}
//                 >
//                     <Input />
//                 </Form.Item>

//                 <Form.Item
//                     label="Password"
//                     name="password"
//                     rules={[
//                         {
//                             required: true,
//                             message: 'Please input your password!',
//                         },
//                     ]}
//                 >
//                     <Input.Password />
//                 </Form.Item>


//                 <Form.Item>
//                     <Button type="primary" htmlType="submit">
//                         Submit
//                     </Button>
//                 </Form.Item>
//             </Form>
//         </div>
//     )
// }

// export default registerPage;

import { Form, Input, Button, notification } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../components/context/auth.context';  // Import AuthContext
import { createUserApi } from '../util/api';  // Đảm bảo rằng API này tồn tại
import '../styles/register.css';  // Thêm file CSS riêng cho register

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { username, email, password } = values;

        // Gọi API để đăng ký người dùng
        const response = await createUserApi(username, email, password);

        if (response) {
            notification.success({
                message: "REGISTER USER",
                description: "Đăng ký thành công!",
            });

            // Điều hướng đến trang chính sau khi đăng ký thành công
            navigate("/");
        } else {
            notification.error({
                message: "REGISTER USER",
                description: response?.EM ?? "Đã có lỗi xảy ra!",
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
                        <Input placeholder="Tên đăng nhập" />
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
