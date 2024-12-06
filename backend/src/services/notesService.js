const { ObjectId } = require('mongodb');
const Notes = require('../model/notes.model');
const { sendEmail } = require('../services/emailService');
const User = require('../model/users.model');

const createNotesService = async (title, content, date, userId) => {
  try {
    let result = await Notes.create({
      title: title,
      content: content,
      date: date,
      userId: userId
    })
    // Send Email for notificate
    const user = await User.findOne({ userID: userId });
    console.log(user);
    if (user && user.email) {
      // Gửi email trong một tác vụ bất đồng bộ riêng biệt
      setImmediate(async () => {
        try {
          await sendEmail(user.email, 'New Note Created for You', 'Hello, a new note has been created for you');
        } catch (err) {
          console.log('Email error: ', err);
        }
      });
    }
    return result;

  } catch (err) {
    console.log(err);
    return null;
  }
}

const deleteNotesService = async (id) => {
  try {
    const result = await Notes.findByIdAndDelete(id);
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
}

const updateNotesService = async (id, title, content, date) => {
  const inputDate = date ? new Date(date) : new Date();
  try {
    const result = await Notes.findByIdAndUpdate(
      id,
      {
        title: title,
        content: content,
        date: inputDate
      },
      { new: true, runValidators: true }
    );

    if (!result) {
      throw new Error("Note not found");
    }

    return result;
  } catch (err) {
    console.error("Error in updateNotesService:", err);
    throw err;
  }
};

module.exports = {
  createNotesService,
  deleteNotesService,
  updateNotesService
}