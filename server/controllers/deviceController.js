const Device = require('../models/Device');

const deviceController = {
  // Get all devices
  getAllDevices: async (req, res) => {
    try {
      const devices = await Device.find();
      res.json({
        count: devices.length,
        devices: devices
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single device
  getDevice: async (req, res) => {
    try {
      const device = await Device.findById(req.params.id);
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add a new device
  addDevice: async (req, res) => {
    const { name, type, status, location, powerConsumption } = req.body;
    const device = new Device({ name, type, status, location, powerConsumption });

    try {
      const newDevice = await device.save();
      res.status(201).json(newDevice);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update device status
  updateDeviceStatus: async (req, res) => {
    try {
      const device = await Device.findById(req.params.id);
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }

      const oldStatus = device.status;
      const newStatus = req.body.status;

      device.status = newStatus;
      device.lastUpdated = Date.now();
      device.lastUserUpdate = Date.now();
      device.lastControlledBy = 'USER'; // Set to USER when manually updated

      // Pause automations only if the user explicitly turns the device OFF
      if (newStatus === 'OFF') {
        device.automationsPaused = true;
        console.log(`USER_UPDATE: ${device.name} status ${oldStatus} -> ${newStatus}. Automations paused (30m).`);
      } else {
        device.automationsPaused = false; // Ensure automations are not paused for ON or STANDBY
        console.log(`USER_UPDATE: ${device.name} status ${oldStatus} -> ${newStatus}.`);
        if (oldStatus === 'OFF' && newStatus === 'ON') {
          console.log(`MONITORING_STARTED: ${device.name} turned ON by user. Monitoring active.`);
        }
      }

      const updatedDevice = await device.save();
      
      res.json(updatedDevice);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = deviceController;  