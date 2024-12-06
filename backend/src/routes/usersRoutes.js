/*--------------INIT SETTING------------ */
const express = require("express");
const users = require('../controller/usersController');
const delay = require("../middleware/delay");
const auth = require("../middleware/auth");
const groupsController = require('../controller/groupsController');
const authorizeRoles = require('../middleware/authorizeRoles');
const users_routes = express.Router();

/*--------------CODE HERE------------ */
users_routes.use(auth); // applies middleware to all routes under users_routes


users_routes.post("/register", users.registerUsers);
users_routes.post("/login", users.loginUsers);
users_routes.get("/user", users.getUsers); //getAllUsers
users_routes.get("/account", delay, users.getAccount); //getAccountInfor
// Route to create a new group (only accessible by admin)
users_routes.post('/groups', authorizeRoles(['admin']), groupsController.createGroup);
users_routes.get('/groups/:userId', authorizeRoles(['admin']), groupsController.getGroups);
users_routes.get('/groups/getUsers/:groupID', authorizeRoles(['admin']), groupsController.getMembersOfGroup);
// Route to add a user to a group (only accessible by admin)
users_routes.post('/groups/add-user', authorizeRoles(['admin']), groupsController.addUserToGroup);
// Route to remove a user in a group (only accessible by admin)
users_routes.post('/groups/remove-user', authorizeRoles(['admin']), groupsController.removeUserFromGroup);
// Route to create a note for a user in a group (only accessible by admin)
users_routes.post('/groups/create-note', authorizeRoles(['admin']), groupsController.createNoteForUser);

users_routes.post('/groups/delete-group/:groupId', authorizeRoles(['admin']), groupsController.deleteGroup);


module.exports = users_routes;
