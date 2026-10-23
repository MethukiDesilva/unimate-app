const router = require("express").Router();
const auth = require("../middleware/auth");
const StudySession = require("../models/StudySession");
const pick = require("../utils/pick");
const allowed = ["title", "date", "minutes", "subject", "status"];

router.use(auth);

// GET my sessions (soonest first)
router.get("/", async (req, res) => {
  try {
    const sessions = await StudySession.find({ user: req.userId })
      .populate("subject", "name")
      .sort({ date: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD a session
router.post("/", async (req, res) => {
  try {
    const session = await StudySession.create({
            ...pick(req.body, allowed),
      user: req.userId,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// EDIT a session (for example mark it completed)
router.put("/:id", async (req, res) => {
  try {
    const session = await StudySession.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
            pick(req.body, allowed),
      { returnDocument: "after", runValidators: true }
    );
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a session
router.delete("/:id", async (req, res) => {
  try {
    const session = await StudySession.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;