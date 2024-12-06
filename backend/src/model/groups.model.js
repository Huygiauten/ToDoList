const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupID: {
        type: String,
        unique: true
    },
    groupName: String,
    members: [{
        userId: {
            type: String,
        }
    }],
    createdBy: String
}, {
    timestamps: true
});

groupSchema.path('members').default(() => []);
const Group = mongoose.model('groups', groupSchema);

module.exports = Group;
