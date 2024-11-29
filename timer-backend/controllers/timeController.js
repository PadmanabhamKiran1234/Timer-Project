const TimerSession = require("../models/TimerSession");

// Complete a session
exports.completeTask = async (req, res) => {
  const { startTime, endTime } = req.body;

  //creation of new session and saving it to database
  try {
    
    const newSession = new TimerSession({
      assessment_start_time: startTime,
      assessment_end_time: endTime,
    });

    
    await newSession.save();

    // Calculate the build time using model logic 
    const buildTime = newSession.calculateBuildTime();

    if (buildTime) {
      
      res.status(200).json({
        message: "Session saved successfully!",
        build_time: buildTime, 
      });
    } else {
      res.status(400).json({ message: "Failed to calculate build time" });
    }
  } catch (error) {
    console.error("Error completing session:", error);
    res.status(500).json({ message: "Error completing session" });
  }
};


