import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../components/context/auth.context";
import "../styles/group.css";
import axios from '../util/axios.customize'; 
import { Link } from 'react-router-dom';

const GroupPage = () => {
    const { auth } = useContext(AuthContext); 
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newGroupName, setNewGroupName] = useState("");  // State to store new group name
    const [isCreatingGroup, setIsCreatingGroup] = useState(false); // Flag for creating a group
    const [error, setError] = useState("");

    // Fetch groups when the component mounts
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`/users/groups/${auth.user.usersID}`);
                setGroups(response); // Assuming the response data is an array of groups
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const handleAddGroup = async () => {
        if (!newGroupName) {
            setError("Group name cannot be empty");
            return;
        }
        try {
            const response = await axios.post('/users/groups', {
                groupName: newGroupName 
            });
            console.log("Group created:", response.group);
            setGroups((prevGroups) => [...prevGroups, response.group]);
            setNewGroupName(""); 
            setIsCreatingGroup(false);
        } catch (error) {
            console.error("Error creating group:", error);
            setError("Failed to create group");
        }
    };

    const handleDeleteGroup = async (groupId) => {
        try {
            await axios.post(`/users/groups/delete-group/${groupId}`);
            setGroups((prevGroups) => prevGroups.filter(group => group.groupID !== groupId));
        } catch (error) {
            console.error("Error deleting group:", error);
            setError("Failed to delete group");
        }
    };

    if (loading) {
        return <div className="loading">Loading groups...</div>;
    }

    return (
        <div className="group-page-container">
            <h1>My Groups</h1>
            
            {isCreatingGroup ? (
                <div className="create-group-form">
                    <input
                        type="text"
                        placeholder="Enter group name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <button onClick={handleAddGroup}>Create Group</button>
                    <button onClick={() => setIsCreatingGroup(false)}>Cancel</button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            ) : (
                <button onClick={() => setIsCreatingGroup(true)} className="add-group-button">Add New Group</button>
            )}

            <div className="group-list">
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <div key={`${group.groupID}-${group.groupName}`} className="group-item">
                            <Link to={`/user/${group.groupID}`}>
                                <h2>{group.groupName}</h2>
                                <p>Group ID: {group.groupID}</p>
                            </Link>
                            <button 
                                onClick={() => handleDeleteGroup(group.groupID)} 
                                className="delete-group-button"
                            >
                                Delete Group
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No groups available.</p>
                )}
            </div>
        </div>
    );
};

export default GroupPage;
