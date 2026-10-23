const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/assignments", require("./routes/assignments"));
app.use("/api/subjects", require("./routes/subjects"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/sessions", require("./routes/sessions"));


app.get("/", (req, res) => {
  res.send("UniMate server is running!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log("Server running on port " + process.env.PORT);
    });
  })
  .catch((err) => console.log("Database error:", err.message));