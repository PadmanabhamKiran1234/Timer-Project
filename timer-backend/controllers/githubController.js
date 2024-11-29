const TimerSession = require("../models/TimerSession");

exports.getForkCreationTime = async (req, res) => {
  const { owner, repo, username } = req.body;

  if (!owner || !repo || !username) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Fetching fork details using GitHub API
    const response = await fetch(
        'https://api.github.com/repos/pankajexa/fs-assessment/forks'
        ,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Using GitHub token for authentication
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ message: "Failed to fetch data from GitHub." });
    }

    const forks = await response.json();

    // Finding fork for the given username
    const userFork = forks.find((fork) => fork.owner.login === username);

    if (!userFork) {
      return res.status(404).json({ message: "Fork not found for the specified user." });
    }

    const forkTime = new Date(userFork.created_at);

    // Saving creation time to database
    const session = new TimerSession({
      assessment_start_time: forkTime,
    });

    const savedSession = await session.save();

    res.status(201).json({
      message: "Fork creation time saved successfully in your database.",
      data: savedSession,
    });
  } catch (error) {
    console.error("Error fetching fork creation time:", error);
    res.status(500).json({ message: "Server error.", error });
  }
};

// Get Fork details 
exports.getForkDetails = async (req, res) => {
  const { id } = req.params; 

  try {
    const session = await TimerSession.findById(id); 

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    // Calculate build time if end time exists
    const buildTime = session.calculateBuildTime();

    res.status(200).json({
      message: "Assessment details fetched.",
      data: {
        start_time: session.assessment_start_time,
        end_time: session.assessment_end_time,
        
      },
    });
  } catch (error) {
    console.error("Error fetching assessment details:", error);
    res.status(500).json({ message: "Server error.", error });
  }
};

