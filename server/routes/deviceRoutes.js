const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/devices', protect, deviceController.addDevice);
router.get('/devices', protect, deviceController.getAllDevices);
router.get('/devices/:id', protect, deviceController.getDevice);
router.patch('/devices/:id/status', protect, deviceController.updateDeviceStatus);

module.exports = router;  