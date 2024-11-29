const express = require("express");
const {
  completeTask,
} = require("../controllers/timeController");

const router = express.Router();

router.post("/complete-session", completeTask);


module.exports = router;
