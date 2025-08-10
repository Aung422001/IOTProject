const Sensor = require('../models/Sensor');
const { checkAutomations } = require('./automations');

const getRandomValue = (type) => {
  switch (type) {
    case 'temperature':
      return (Math.random() * 15) + 15; // 15-30
    case 'humidity':
      return (Math.random() * 30) + 30; // 30-60
    case 'light':
      return Math.random() * 1000; // 0-1000
    case 'motion':
      return Math.random() > 0.8 ? 1 : 0; // 20% chance of motion
    case 'gas':
      return (Math.random() * 50) + 10; // 10-60
    case 'sound':
      return (Math.random() * 60) + 40; // 40-100
    default:
      return 0;
  }
};

const simulateSensors = async () => {
  const sensors = await Sensor.find();

  if (sensors.length === 0) {
    console.log('SIMULATION: No sensors found in the database. Pausing simulation.');
    return;
  }

  console.log(`SIMULATION: Found ${sensors.length} sensors. Updating values...`);
  for (const sensor of sensors) {
    const oldValue = sensor.value;
    sensor.value = getRandomValue(sensor.type);
    sensor.updatedAt = Date.now();
    await sensor.save();
    // console.log(`SIMULATION: Sensor '${sensor.name}' value updated from ${oldValue.toFixed(2)} to ${sensor.value.toFixed(2)}`);
    await checkAutomations(sensor);
  }
  console.log("Sensor data updated");
};

const startSimulation = () => {
  setInterval(simulateSensors, 10000); // Run every 10 seconds
};

module.exports = { startSimulation };
