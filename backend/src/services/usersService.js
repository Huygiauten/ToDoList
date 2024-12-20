const Users = require("../model/users.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
require('dotenv').config();

const registerUsersService = async (name, email, password, role) => {
    try {
        const usersExist = await Users.findOne({ email: email });
        if (usersExist) {
            return { exists: true };
        } else {
            const hashPassword = await bcrypt.hash(password, saltRounds);
            let result = await Users.create({
                name: name,
                email: email,
                password: hashPassword,
                role: role,
                userID: '2021' + Math.floor(100000 + Math.random() * 900000)
            })

            return result;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}

const loginUsersService = async (email, password) => {
    try {
        //fetch user by email
        const user = await Users.findOne({ email: email });

        if (user) {
            //compare password
            const isMatchedPassword = await bcrypt.compare(
                password, user.password
            )
            if (!isMatchedPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ"
                }
            } else {
                const payload = {
                    email: user.email,
                    name: user.name,
                    usersID: user.userID,
                    role: user.role,
                    _id: user._id.toString(), //convert userId from ObjectId to String
                }
                //create an access token 
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                );
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name,
                        usersID: user.userID,
                        role: user.role,
                        _id: user._id.toString(),
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            }
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}

const getUsersService = async () => {
    try {
        const result = await Users.find({}).select("-password");
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
}



module.exports = {
    registerUsersService,
    loginUsersService,
    getUsersService
}
