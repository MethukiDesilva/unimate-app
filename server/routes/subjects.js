const router = require("express").Router();
const auth = require("../middleware/auth");
const Subject = require("../models/Subject");
const Assignment = require("../models/Assignment");
const Note = require("../models/Note");
const StudySession = require("../models/StudySession");

router.use(auth);

// GET all my subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.userId }).sort({ name: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD a subject
router.post("/", async (req, res) => {
  try {
    const subject = await Subject.create({
      name: req.body.name,
      user: req.userId,
    });
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a subject
router.delete("/:id", async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    // assignments that used this subject become "no subject"
    await Assignment.updateMany(
      { subject: req.params.id, user: req.userId },
      { subject: null }
    );
        await Note.updateMany(
      { subject: req.params.id, user: req.userId },
      { subject: null }
    );
        await StudySession.updateMany(
      { subject: req.params.id, user: req.userId },
      { subject: null }
    );
    
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;