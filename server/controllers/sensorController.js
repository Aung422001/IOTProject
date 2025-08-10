const Sensor = require('../models/Sensor');

const { updateSensor } = require('../lib/sensorUpdates');

const sensorController = {
  // Get all sensors
  getAllSensors: async (req, res) => {
    try {
      const sensors = await Sensor.find().populate('device');
      res.json({
        count: sensors.length,
        sensors: sensors,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single sensor
  getSensor: async (req, res) => {
    try {
      const sensor = await Sensor.findById(req.params.id).populate('device');
      if (!sensor) {
        return res.status(404).json({ message: 'Sensor not found' });
      }
      res.json(sensor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add a new sensor
  addSensor: async (req, res) => {
    const { name, type, device } = req.body;
    const sensor = new Sensor({ name, type, device });

    try {
      const newSensor = await sensor.save();
      res.status(201).json(newSensor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update a sensor
  updateSensor,
};

module.exports = sensorController;
