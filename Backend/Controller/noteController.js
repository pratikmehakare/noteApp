const Note = require("../model/note.model")

//Add Note
exports.addNote = async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;
  
    if (!title) {
      return res.status(400).json({
        error: true,
        message: "Enter title",
      });
    }
  
    if (!content) {
      return res.status(400).json({
        error: true,
        message: "Enter content",
      });
    }
  
    try {
      const note = new Note({
        title,
        content,
        tags: tags || [],
        userId: user._id,
      });
  
      await note.save();
  
      return res.json({
        error: false,
        note,
        message: "Note Added",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Error",
      });
    }
}
//Get All Notes
exports.getAllNotes= async (req, res) => {
    const { user } = req.user;
  
    try {
      const notes = await Note.find({ userId: user._id }).sort({
        isPinned: -1,
      });
      return res.json({
        error: false,
        notes,
        message: "All Notes Retrived..",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Interna error",
      });
    }
}  
//Edit Note
exports.editNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
  
    const { user } = req.user;
  
    if (!title || !tags || !content) {
      return res.status(400).json({
        error: true,
        message: "No changes provided",
      });
    }
  
    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });
  
      if (!note) {
        return res.status(404).json({
          error: true,
          message: "Note not found",
        });
      }
  
      if (title) note.title = title;
      if (content) note.content = content;
      if (tags) note.tags = tags;
      if (isPinned) note.isPinned = isPinned;
  
      await note.save();
  
      return res.json({
        error: false,
        note,
        message: "Note Added",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Error",
      });
    }
}
//Delete Note
exports.deleteNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;
  
    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });
  
      if (!note) {
        return res.status(400).json({
          error: true,
          message: "Note not Found",
        });
      }
  
      await Note.deleteOne({ _id: noteId, userId: user._id });
  
      return res.json({
        error: false,
        message: "Deleted",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Error",
      });
    }
}
//Update Pinned Note  
exports.updatePinnedNote = async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;
  
    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });
  
      if (!note) {
        return res.status(404).json({
          error: true,
          message: "Note not found",
        });
      }
  
      note.isPinned = isPinned 
  
      await note.save();
  
      return res.json({
        error: false,
        note,
        message: "Note Added",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Error",
      });
    }
}
//Search Note  
exports.searchNotes = async (req, res) => {
    
    const { query } = req.query;
    const { user } = req.user;
  
    if(!query){
      return res.status(400).json({
        error:true,
        message:"Search query is required"
      })
    }
  
    try{
      const matchingNotes = await Note.find({
        userId: user._id,
        $or:[
          {title: {$regex: new RegExp(query, "i")}},
          {content: {$regex: new RegExp(query,"i")}},
        ]
      });
  
      return res.json({
        error:false,
        notes:matchingNotes,
        message:"Query Search.."
      })
  
    }catch(error){
      return res.status(500).json({
        error:true,
        message:"Internal Server Error"
      })
    }
}
  