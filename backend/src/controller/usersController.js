
const express = require("express");
require('dotenv').config()
const cors = require("cors");
const { registerUsersService, loginUsersService, getUsersService, getUserInforService } = require("../services/usersService.js");

const app = express();
app.use(express.json());
app.use(cors());


const registerUsers = async (req, res) => {

    const { name, email, password, role } = req.body;
    try {
        const data = await registerUsersService(name, email, password, role);
        if (!data) {
            return res.status(400).send("Error");
        }

        if (data.exists) {
            return res.status(409).send("Conflict");
        }
        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }

}

const loginUsers = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginUsersService(email, password);
    return res.status(200).json(data);
}

const getUsers = async (req, res) => {
    const data = await getUsersService();
    return res.status(200).json(data);
}

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}

const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        // Ensure the role is either 'user' or 'admin'
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
}

module.exports = {
    registerUsers,
    loginUsers,
    getUsers,
    getAccount,
    updateUserRole,
};
