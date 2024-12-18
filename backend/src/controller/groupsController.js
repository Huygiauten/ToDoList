// groupsController.js
const Group = require('../model/groups.model'); // Assuming there's a Group model
const User = require('../model/users.model'); // Assuming there's a User model
const { sendEmail } = require('../services/emailService');

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const { groupName } = req.body;
        const group = await Group.findOne({ groupName: groupName })
        if (group) {
            return res.status(404).json({ message: 'Group exits' });
        }

        // Create new group with members (members should be an array of user IDs)
        const newGroup = new Group({
            groupID: '2021' + Math.floor(1000 + Math.random() * 9000).toString(),
            groupName,
            members: [],
            createdBy: req.user.usersID // Assuming req.user contains the authenticated user
        });

        await newGroup.save();
        res.status(201).json({ message: 'Group created successfully', group: newGroup });
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error });
    }
};

// Add a user to a group
exports.addUserToGroup = async (req, res) => {
    try {
        const { groupId, userId  } = req.body;
        const group = await Group.findOne({ groupID: groupId });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.members.some(member => member.userId?.toString() === userId)) {
            return res.status(400).json({ message: 'User is already a member of the group' });
        }

        group.members.push({
            userId: userId
        });

        await group.save();
        res.status(200).json({ message: 'User added to group successfully', group });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding user to group', error });
    }
};

// Create a note for a user in a group
exports.createNoteForUser = async (req, res) => {
    // try {
    //     const { groupId, userId, noteContent } = req.body;
    //     const group = await Group.findOne({ email: email });

    //     if (!group) {
    //         return res.status(404).json({ message: 'Group not found' });
    //     }

    //     if (!group.members.includes(userId)) {
    //         return res.status(400).json({ message: 'User is not a member of this group' });
    //     }

    //     // Assuming notes are part of the group document, linked to a user
    //     group.notes.push({ userId, content: noteContent });
    //     await group.save();
    //     // Send Email for notificate
    //     const user = await User.findById(userId);
    //     if (user && user.email) {
    //         await sendEmail(user.email, 'New Note Created for You', `Hello, a new note has been created for you in group "${group.groupName}": ${noteContent}`);
    //     }
    //     res.status(201).json({ message: 'Note created successfully', group });
    // } catch (error) {
    //     res.status(500).json({ message: 'Error creating note', error });
    // }
};

exports.removeUserFromGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        // Tìm nhóm theo groupID
        const group = await Group.findOne({ groupID: groupId });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Tìm người dùng trong mảng members và xóa khỏi mảng nếu tồn tại
        const memberIndex = group.members.findIndex(member => member.userId.toString() === userId);
        if (memberIndex === -1) {
            return res.status(404).json({ message: 'User not found in the group' });
        }

        // Xóa người dùng khỏi mảng members
        group.members.splice(memberIndex, 1);
        await group.save();

        res.status(200).json({ message: 'User removed from group successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error removing user from group', error });
    }
};

exports.getGroups = async (req, res) => {
    try {
        const userId = req.params.userId
        const result = await Group.find({createdBy:userId}).select("-members")
        if (!result) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        req.status(500).json(err)
    }
}

exports.getMembersOfGroup = async (req, res) => {
    try {
        const { groupID } = req.params;
        const group = await Group.findOne({ groupID });
        console.log(group);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const userIds = group.members.map(member => member.userId);
        console.log(userIds);
        const users = await User.find({ 'userID': { $in: userIds.map(id => id?.toString())} }).select("-password");
        console.log(users);

        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving members", error: err });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params; 

        const group = await Group.findOne({ groupID: groupId });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        await Group.deleteOne({ groupID: groupId });

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Error deleting group', error });
    }
};