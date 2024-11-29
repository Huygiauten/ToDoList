// const Groups = require("../model/groups.model");
// const { exists } = require("../model/notes.model");
// require('dotenv').config();


// const createGroupService = async (adminId, groupName, members) => {
//     try {
//         const groupExist = await Groups.findOne({ groupName: groupName });
//         if (groupExist) {
//             return { exists: true };
//         } else {
//             let newGroup = await Groups.create({
//                 groupID: '2021' + Math.floor(1000 + Math.random() * 9000).toString(),
//                 groupName,
//                 members: members.map(member => ({
//                     userId: member.userId,
//                     name: member.name,
//                     email: member.email
//                 })),
//                 createdBy: adminId
//             });

//             return newGroup;
//         }
//     } catch (err) {
//         return null;
//     }
// }

// const getGroupsService = async (adminId) => {
//     try {
//         const result = await Groups.find({ createdBy: adminId });
//         return result;
//     } catch (err) {
//         console.log(err);
//         return null;
//     }
// }

// module.exports = {
//     createGroupService,
//     getGroupsService
// }