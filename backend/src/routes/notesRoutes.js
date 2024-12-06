//Routes for CRUD here
/*--------------INIT SETTING------------ */
const express = require("express");
const addNotes = require('../controller/notesController.js');
const notes_router = express.Router();

/*--------------CODE HERE------------ */
notes_router.post("/", addNotes.createNote);
notes_router.get("/:id", addNotes.getNotes);//pass userId as params
notes_router.get("/groups/:userId", addNotes.getNotesInGroup);//pass userId as params
notes_router.delete("/:id", addNotes.deleteNotes);
notes_router.put("/:id", addNotes.updateNote);
notes_router.post("/notes_group", addNotes.createNote);

module.exports = notes_router;
