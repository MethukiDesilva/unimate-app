const router = require("express").Router();
const auth = require("../middleware/auth");
const Note = require("../models/Note");
const pick = require("../utils/pick");

// the only fields a note request may set
const allowed = ["title", "content", "subject"];

router.use(auth);

// GET my notes (optionally only one subject: /api/notes?subject=ID)
router.get("/", async (req, res) => {
  try {
    const filter = { user: req.userId };
    if (req.query.subject) {
      filter.subject = req.query.subject;
    }
    const notes = await Note.find(filter)
      .populate("subject", "name")
      .sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD a note
router.post("/", async (req, res) => {
  try {
    const note = await Note.create({
      ...pick(req.body, allowed),
      user: req.userId,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// EDIT a note
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      pick(req.body, allowed),
      { returnDocument: "after", runValidators: true }
    );
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;