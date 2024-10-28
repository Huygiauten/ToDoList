# Cơ Sở Dữ Liệu Cho Ứng Dụng ToDoList

## Mô tả

Cơ sở dữ liệu này được thiết kế cho ứng dụng web To Do List, bao gồm các chức năng CRUD (Create, Read, Update, Delete). Cơ sở dữ liệu sử dụng MongoDB và bao gồm các bảng chính như sau: `users`, `notes`, `groups`.

## Cấu trúc Cơ sở Dữ liệu

### 1. Bảng `users`

Lưu trữ thông tin người dùng (khách hàng và quản trị viên).

| Trường         | Kiểu dữ liệu     | Mô tả                          |
|----------------|------------------|---------------------------------|
| userID         | VARCHAR(255) PK  | ID của người dùng, duy nhất và bắt buộc |
| name           | VARCHAR(255)     | Tên của người dùng             |
| email          | VARCHAR(255)     | Email của người dùng           |
| password       | VARCHAR(255)     | Mật khẩu của người dùng        |
| role           | ENUM('user', 'admin') | Vai trò của người dùng, có thể là 'user' hoặc 'admin' |

### 2. Bảng `groups`

Lưu trữ thông tin các nhóm công việc.

| Trường         | Kiểu dữ liệu     | Mô tả                          |
|----------------|------------------|---------------------------------|
| groupID        | SERIAL PK        | ID của nhóm, tự động tăng       |
| groupName      | VARCHAR(255)     | Tên của nhóm, bắt buộc          |
| createdBy      | VARCHAR(255)     | ID của người tạo nhóm, tham chiếu đến bảng `users` |
| created_at     | TIMESTAMP        | Thời gian tạo nhóm, mặc định là thời gian hiện tại |
| updated_at     | TIMESTAMP        | Thời gian cập nhật nhóm, tự động cập nhật khi có thay đổi |


### 3. Bảng `notes`

Lưu trữ thông tin các ghi chú của người dùng.

| Trường         | Kiểu dữ liệu     | Mô tả                          |
|----------------|------------------|---------------------------------|
| noteID         | SERIAL PK        | ID của ghi chú, tự động tăng    |
| title          | VARCHAR(255)     | Tiêu đề của ghi chú            |
| content        | TEXT             | Nội dung của ghi chú           |
| date           | TIMESTAMP        | Ngày tạo ghi chú, mặc định là thời gian hiện tại |
| userId         | VARCHAR(255) FK  | ID của người dùng tạo ghi chú, tham chiếu đến bảng `users` |
