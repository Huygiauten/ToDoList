import React, { useState, useEffect } from 'react';
import { notification, Table, Spin, Input, Button, Modal, Form, DatePicker } from 'antd';
import { getUserApi } from '../util/api';
import '../styles/usersPage.css';
import axios from '../util/axios.customize';

const { Search } = Input;

const UsersPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState(null);
    const [notes, setNotes] = useState([]);
    const [userNotes, setUserNotes] = useState([]); // Store notes of the selected user
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // For selected notes

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
                        description: res.message,
                        duration: 2,
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Error",
                    description: "An error occurred while fetching user data.",
                    duration: 2,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const fetchUserNotes = async (userId) => {
        try {
            const res = await axios.get(`/notes/groups/${userId}`);
            setUserNotes(res);
            setIsNotesModalVisible(true);
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to fetch notes for the user.",
            });
        }
    };

    const handleSearch = (value) => {
        const filtered = dataSource.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const showAddNoteModal = (userId) => {
        setSelectedUserId(userId);
        setIsModalVisible(true);
    };

    const handleAddNoteForUsers = async (event) => {
        event.preventDefault();
        try {
            const id = selectedUserId;
            const response = await axios.post("/notes/notes_group", {
                title,
                content,
                id,
                date
            });
            const newNote = response.data;
            setNotes([newNote, ...notes]);
            setTitle("");
            setContent("");

            notification.success({
                message: "Note Added",
                description: "The note was added successfully.",
                duration: 2,
            });
            setIsModalVisible(false);
        } catch (err) {
            notification.error({
                message: "Error",
                description: "Failed to add the note.",
                duration: 2,
            });
        }
    };

    const handleDeleteSelectedNotes = async () => {
        try {
            await Promise.all(selectedRowKeys.map(noteId => axios.delete(`/notes/${noteId}`)));
            setUserNotes(userNotes.filter(note => !selectedRowKeys.includes(note._id)));
            setSelectedRowKeys([]);
            notification.success({
                message: "Notes Deleted",
                description: "The selected notes were deleted successfully.",
                duration: 2,
            });
        } catch (err) {
            notification.error({
                message: "Error",
                description: "Failed to delete the selected notes.",
                duration: 2,
            });
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: !record, // Disable if record is undefined (header rows are not selectable by default)
        }),
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'userID',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text, record) => (
                record.role === 'user' ? (
                    <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => fetchUserNotes(record.userID)}>
                        {text}
                    </span>
                ) : (<span>
                    {text}
                </span>)
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Note',
            render: (_, record) => (
                record.role === 'user' ? (
                    <Button onClick={() => showAddNoteModal(record.userID)}>
                        Add Note
                    </Button>
                ) : null
            ),
        },
    ];

    const userNotesColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Content',
            dataIndex: 'content',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            render: (date) => new Date(date).toLocaleDateString()
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
                    rowKey={'userID'}
                    pagination={{ pageSize: 10 }}
                />
            )}

            <Modal
                title="Add Note"
                open={isModalVisible}
                onOk={handleAddNoteForUsers}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="Title">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title"
                            required
                        />
                    </Form.Item>
                    <Form.Item label="Content">
                        <Input.TextArea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter note content"
                            rows={4}
                            required
                        />
                    </Form.Item>
                    <Form.Item label="Date">
                        <DatePicker
                            value={date}
                            onChange={(date) => setDate(date)}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="User Notes"
                open={isNotesModalVisible}
                onOk={() => setIsNotesModalVisible(false)}
                onCancel={() => setIsNotesModalVisible(false)}
                footer={[
                    <Button
                        key="delete"
                        type="danger"
                        onClick={handleDeleteSelectedNotes}
                        disabled={selectedRowKeys.length === 0}
                    >
                        Delete Selected Notes
                    </Button>,
                ]}
            >
                <Table
                    dataSource={userNotes}
                    columns={userNotesColumns}
                    rowSelection={rowSelection}
                    bordered
                    rowKey={'_id'}
                    pagination={{ pageSize: 5 }}
                />
            </Modal>
        </div>
    );
};

export default UsersPage;