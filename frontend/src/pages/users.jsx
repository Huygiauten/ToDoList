import React, { useState, useEffect } from 'react';
import { notification, Table, Spin, Input, Button, Modal, Form, DatePicker } from 'antd';
import { getUserApi } from '../util/api';
import '../styles/usersPage.css';
import axios from '../util/axios.customize';
import { Link, useParams } from 'react-router-dom';

const { Search } = Input;

const UsersPage = () => {
    const { groupId } = useParams();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
    const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState(null);
    const [notes, setNotes] = useState([]);
    const [userNotes, setUserNotes] = useState([]); 
    const [newMemberID, setNewMemberID] = useState("");
    const [newMemberData, setNewMemberData] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); 


    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await getUserApi(groupId);
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
    }, [newMemberData]);


    const handleAddMember = async () => {
        if (!newMemberID) {
            notification.error({
                message: 'Error',
                description: 'Please enter a valid ID to add a member.',
            });
            return;
        }
        try {
            const response = await axios.post(`/users/groups/add-user`, { 
                groupId : groupId,
                userId : newMemberID
            });
            if (response) {
                const newMemberData = response.group.members[response.group.members.length - 1]
                setDataSource([newMemberData,...dataSource]);
                setNewMemberData([newMemberData,...dataSource])
                setFilteredData([newMemberData,...dataSource]);
                setIsAddMemberModalVisible(false);
                setNewMemberID(""); // Clear input
                notification.success({
                    message: 'Success',
                    description: 'New member added successfully.',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: response.data.message,
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to add member to the group.',
            });
        }
    };

    const showAddMemberModal = () => {
        setIsAddMemberModalVisible(true);
    };

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

    const handleDeleteMember = async (userId) => {
        try {
            const response = await axios.post(`/users/groups/remove-user`, { 
                    groupId: groupId, 
                    userId: userId 
                }
            );
            
            if (response) {
                const newGroupData = response.group.members;
                setDataSource(newGroupData);
                setNewMemberData(newGroupData)
                setFilteredData(newGroupData);
    
                notification.success({
                    message: 'Success',
                    description: 'Member removed successfully.',
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to remove member.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while removing the member.',
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
                    <>
                    <Button onClick={() => showAddNoteModal(record.userID)} style={{ marginRight: 8 }}>
                        Add Note
                    </Button>
                    <Button onClick={() => handleDeleteMember(record.userID)} style={{backgroundColor: '#ff4d4f',
                                                                                        color: 'white',
                                                                                        border: 'none',
                                                                                        fontWeight: 'bold',
                                                                                        padding: '12px 25px',
                                                                                        borderRadius: '50px',
                                                                                        transition: 'background-color 0.3s, box-shadow 0.3s, transform 0.3s',
                                                                                        fontSize: '16px',
                                                                                    }} >
                                                                                        
                        Remove Member
                    </Button>
                </>
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
            <Button type="primary" onClick={showAddMemberModal} className="add-member-button">
                Add Member
            </Button>
            {loading ? (
                <div className="users-page-loading">
                    <Spin size="large" />
                </div>
            ) : (
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    bordered
                    rowKey={(record) => `${record.userID}-${record.role}`}
                    pagination={{ pageSize: 10 }}
                />
            )}

            {/* Modal for adding a new member */}
            <Modal
                title="Add New Member to Group"
                open={isAddMemberModalVisible}
                onOk={handleAddMember}
                onCancel={() => setIsAddMemberModalVisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="ID">
                        <Input
                            value={newMemberID}
                            onChange={(e) => setNewMemberID(e.target.value)}
                            placeholder="Enter the new member's ID"
                            required
                        />
                    </Form.Item>
                </Form>
            </Modal>

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
                    rowKey={(record) => `${record._id}`}
                    pagination={{ pageSize: 5 }}
                />
            </Modal>
        </div>
    );
};

export default UsersPage;