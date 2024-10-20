# Sports Store Database

## Mô tả

Cơ sở dữ liệu này được thiết kế cho ứng dụng web bán đồ thể thao, bao gồm các chức năng CRUD (Create, Read, Update, Delete). Cơ sở dữ liệu sử dụng MongoDB và bao gồm các bảng chính như sau: `users`, `products`, `orders`, `order_items`, và `categories`.

## Cấu trúc Cơ sở Dữ liệu

### 1. Bảng `users`

Lưu trữ thông tin người dùng (khách hàng và quản trị viên).

| Trường         | Kiểu dữ liệu  | Mô tả                          |
|----------------|---------------|---------------------------------|
| id             | INT (PK)      | ID người dùng, tự tăng         |
| username       | VARCHAR(50)   | Tên đăng nhập                  |
| password       | VARCHAR(255)  | Mật khẩu (băm)                 |
| email          | VARCHAR(100)  | Địa chỉ email                   |
| role           | ENUM          | Vai trò (customer/admin)        |
| created_at     | TIMESTAMP     | Thời gian tạo                   |
| updated_at     | TIMESTAMP     | Thời gian cập nhật              |

