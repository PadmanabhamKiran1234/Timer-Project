const mongoose = require('mongoose');

const TimerSessionSchema = new mongoose.Schema(
  {
    assessment_start_time: {
      type: Date,
      required: true,
    },
    assessment_end_time: {
      type: Date,
    },
  },
  {
    timestamps: true, 
  }
);

TimerSessionSchema.methods.calculateBuildTime = function () {
  if (this.assessment_end_time) {
    const start = new Date(this.assessment_start_time);
    const end = new Date(this.assessment_end_time);
    const durationInSeconds = (end - start) / 1000; 
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return { minutes, seconds };
  }
  return null;
};

module.exports = mongoose.model('TimerSession', TimerSessionSchema);
