const Device = require('../models/Device');

const checkAutomations = async (sensor) => {
  const devices = await Device.find({ 'automations.sensorType': sensor.type });

  for (const device of devices) {
    // Check if automations are paused for this device due to a recent user update
    if (device.automationsPaused && device.lastControlledBy === 'USER' && device.lastUserUpdate) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (device.lastUserUpdate > thirtyMinutesAgo) {
        console.log(`AUTOMATION_PAUSED: ${device.name} automations paused (user OFF).`);
        continue; // Skip automation for this device
      } else {
        // 30 minutes have passed, resume automations
        device.automationsPaused = false;
        device.lastUserUpdate = null;
        await device.save();
        console.log(`AUTOMATION_RESUMED: ${device.name} automations resumed.`);
      }
    }

    for (const automation of device.automations) {
      if (automation.sensorType === sensor.type) {
        let action = false;
        switch (automation.condition) {
          case 'GREATER_THAN':
            if (sensor.value > automation.threshold) action = true;
            break;
          case 'LESS_THAN':
            if (sensor.value < automation.threshold) action = true;
            break;
          case 'EQUALS':
            if (sensor.value == automation.threshold) action = true;
            break;
        }

        if (action && device.status !== automation.action) {
          // Prevent automation from turning an OFF device ON if it was turned OFF by a user
          if (device.status === 'OFF' && automation.action === 'ON' && device.lastControlledBy === 'USER') {
            console.log(`AUTOMATION_BLOCKED: ${device.name} cannot be turned ON by automation (user OFF).`);
            continue; // Skip this automation
          }

          const oldStatus = device.status;
          device.status = automation.action;
          device.lastControlledBy = 'AUTOMATION'; // Set to AUTOMATION when automation changes status
          await device.save();
          console.log(`AUTOMATION: Device '${device.name}' status changed from ${oldStatus} to ${device.status} due to ${sensor.type} value of ${sensor.value.toFixed(2)}`);
        }
      }
    }
  }
};

module.exports = { checkAutomations };
