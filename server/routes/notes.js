const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/auth.js");

// GET /api/notes/ -> list user's notes (with optional ?q=search)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { q, tags } = req.query;
    const query = { user: req.user.id };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    if (tags) {
      // tags is comma separated
      const tagArr = tags.split(",").map((t) => t.trim());
      query.tags = { $in: tagArr };
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// POST /api/notes/ -> create
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = new Note({
      title,
      content,
      tags,
      user: req.user.id, // ✅ use id not _id
    });
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// PUT /api/notes/:id -> update
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: "Note not found" });
    if (note.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    const { title, content, tags } = req.body;
    note.title = title ?? note.title;
    note.content = content ?? note.content;
    note.tags = tags ?? note.tags;

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// DELETE /api/notes/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: "Note not found" });
    if (note.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await Note.deleteOne({ _id: req.params.id });
    res.json({ msg: "Note removed" });
  } catch (err) {
    console.error("Delete note error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get single note
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id, // match your schema field
    });

    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json(note);
  } catch (err) {
    // handle invalid ObjectId
    if (err.kind === "ObjectId") {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
