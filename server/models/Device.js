const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['LIGHT', 'AC', 'PRINTER', 'COFFEE_MACHINE'],
    required: true
  },
  status: {
    type: String,
    enum: ['ON', 'OFF', 'STANDBY'],
    default: 'OFF'
  },
  location: {
    type: String,
    required: true
  },
  powerConsumption: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastUserUpdate: {
    type: Date,
    default: null
  },
  automationsPaused: {
    type: Boolean,
    default: false
  },
  lastControlledBy: {
    type: String,
    enum: ['USER', 'AUTOMATION'],
    default: 'USER'
  },
  lastControlledBy: {
    type: String,
    enum: ['USER', 'AUTOMATION'],
    default: 'USER'
  },
  automations: [{
    sensorType: {
      type: String,
      required: true
    },
    threshold: {
      type: Number,
      required: true
    },
    condition: {
      type: String,
      enum: ['GREATER_THAN', 'LESS_THAN', 'EQUALS'],
      required: true
    },
    action: {
      type: String,
      enum: ['ON', 'OFF', 'STANDBY'],
      required: true
    }
  }]
}, {
  toJSON: {
    transform: function (doc, ret) {
      delete ret.automations;
      return ret;
    }
  }
});

module.exports = mongoose.model('Device', deviceSchema); 