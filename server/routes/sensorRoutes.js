const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const { protect } = require('../middleware/authMiddleware');

// Get all sensors
router.get('/sensors', protect, sensorController.getAllSensors);

// Get single sensor
router.get('/sensors/:id', protect, sensorController.getSensor);

// Add a new sensor
router.post('/sensors', protect, sensorController.addSensor);

// Update a sensor
router.patch('/sensors/:id', protect, sensorController.updateSensor);

module.exports = router;
