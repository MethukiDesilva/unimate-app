const router = require("express").Router();
const auth = require("../middleware/auth");
const Assignment = require("../models/Assignment");
const pick = require("../utils/pick");
const allowed = ["title", "description", "dueDate", "priority", "status", "subject"];

// every route below needs a valid token
router.use(auth);

// GET all my assignments (earliest due date first)
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.userId })
      .populate("subject", "name")
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD a new assignment
router.post("/", async (req, res) => {
  try {
    const assignment = await Assignment.create({
        ...pick(req.body, allowed),
      user: req.userId,
    });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// EDIT an assignment
router.put("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
           pick(req.body, allowed),
      { returnDocument: "after", runValidators: true }
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an assignment
router.delete("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;