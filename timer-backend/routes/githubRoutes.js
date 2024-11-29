const express = require("express");
const { getForkCreationTime , getForkDetails} = require("../controllers/githubController");

const router = express.Router();

router.post("/fork-time", getForkCreationTime);
router.get("/assessment-details/:id", getForkDetails);
module.exports = router;
