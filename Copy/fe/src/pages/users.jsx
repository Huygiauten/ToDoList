// import {notification, Table} from 'antd';
// import { useEffect, useState } from 'react';
// import { getUserApi } from '../util/api';

// const UsersPage = () =>{
//     const [dataSource, setDataSource] = useState([]);

//     useEffect(()=>{
//         const fetchUser = async () =>{
//             const res = await getUserApi();
//             if(!res?.message){
//                 setDataSource(res);
//             }else{
//                 notification.error({
//                     message: "Unauthorized",
//                     description: res.message
//                 })
//             }
//         }
//         fetchUser();
//     }, []);

//     const columns = [
//     {
//         title: 'Id',
//         dataIndex: '_id',

//     },
//     {
//         title: 'Email',
//         dataIndex: 'email',

//     },
//     {
//         title: 'Name',
//         dataIndex: 'name',

//     },
//     {
//         title: 'Role',
//         dataIndex: 'role',

//     },
//     ];


//     return (
//         <div style={{padding: 30}}>
//             <Table 
//             dataSource={dataSource} 
//             columns={columns} 
//             bordered
//             rowKey={'_id'}
//             />
//         </div>
//     )
// }

// export default UsersPage;


import { notification, Table, Spin, Input } from 'antd';
import { useEffect, useState } from 'react';
import { getUserApi } from '../util/api';
import '../styles/usersPage.css';

const { Search } = Input;

const UsersPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await getUserApi();
                if (!res?.message) {
                    setDataSource(res);
                    setFilteredData(res);
                } else {
                    notification.error({
                        message: "Unauthorized",
                        description: res.message
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: "An error occurred while fetching user data."
                });
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    const handleSearch = (value) => {
        const filtered = dataSource.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'userID',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
    ];

    return (
        <div className="users-page">
            <Search
                placeholder="Search by name or email"
                enterButton
                onSearch={handleSearch}
                className="users-page-search"
            />
            {loading ? (
                <div className="users-page-loading">
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    bordered
                    rowKey={'_id'}
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
}

export default UsersPage;
