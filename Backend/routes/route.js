const express = require("express");
const { login, signUp, getUser } = require("../Controller/authController");
const { authenticateToken } = require("../middleware/utitlities")
const { addNote, getAllNotes, editNote, searchNotes, updatePinnedNote, deleteNote } = require("../Controller/noteController");
const route = express.Router();

route.post("/login",login)
route.post("/create-account",signUp)
route.get("/get-user",authenticateToken,getUser);
route.post("/add-note", authenticateToken,addNote)
route.get("/search-notes/", authenticateToken,searchNotes)
route.get("/get-all-notes", authenticateToken,getAllNotes)
route.put("/edit-note/:noteId", authenticateToken,editNote)
route.delete("/delete-note/:noteId", authenticateToken, deleteNote)
route.put("/update-note-pinned/:noteId", authenticateToken,updatePinnedNote)

module.exports = route;