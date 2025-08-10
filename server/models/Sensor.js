const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['temperature', 'humidity', 'light', 'motion', 'gas', 'sound'],
    required: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Sensor', sensorSchema);
