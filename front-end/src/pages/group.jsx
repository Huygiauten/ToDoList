import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../components/context/auth.context";
import "../styles/group.css"; // Import general styles for consistency
import axios from '../util/axios.customize'; // For making API requests

const GroupPage = () => {
    const { auth } = useContext(AuthContext); // Access user information
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch groups on initial load
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`/users/groups/${auth.user.usersID}`);
                setGroups(response.data); // Assuming the response data contains the group list
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, [auth.user._id]);

    if (loading) {
        return <div className="loading">Loading groups...</div>; // Simple loading state
    }

    return (
        <div className="group-page-container">
            <h1>My Groups</h1>
            <div className="group-list">
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <div key={group.id} className="group-item">
                            <h2>{group.name}</h2>
                            <p>{group.description}</p>
                            <span>Members: {group.membersCount}</span>
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
