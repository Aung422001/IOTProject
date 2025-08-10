const mongoose = require('mongoose');
const Sensor = require('./models/Sensor');
const Device = require('./models/Device');
require('dotenv').config();

const sensorsData = [
  { "name": "Living Room Temperature", "type": "temperature", "value": 22 },
  { "name": "Living Room Humidity", "type": "humidity", "value": 45 },
  { "name": "Office Light Sensor", "type": "light", "value": 500 },
  { "name": "Hallway Motion Sensor", "type": "motion", "value": 0 },
  { "name": "Kitchen Gas Sensor", "type": "gas", "value": 30 },
  { "name": "Living Room Sound Sensor", "type": "sound", "value": 40 }
];

const devicesData = [
  {
    "name": "Living Room AC",
    "type": "AC",
    "status": "OFF",
    "location": "Living Room",
    "automations": [
      { "sensorType": "temperature", "threshold": 26, "condition": "GREATER_THAN", "action": "ON" },
      { "sensorType": "temperature", "threshold": 22, "condition": "LESS_THAN", "action": "OFF" }
    ],
    "lastControlledBy": "USER"
  },
  {
    "name": "Office Ceiling Light",
    "type": "LIGHT",
    "status": "OFF",
    "location": "Office",
    "automations": [
      { "sensorType": "light", "threshold": 400, "condition": "LESS_THAN", "action": "ON" },
      { "sensorType": "light", "threshold": 800, "condition": "GREATER_THAN", "action": "OFF" }
    ],
    "lastControlledBy": "USER"
  },
  {
    "name": "Hallway Light",
    "type": "LIGHT",
    "status": "OFF",
    "location": "Hallway",
    "automations": [
      { "sensorType": "motion", "threshold": 1, "condition": "EQUALS", "action": "ON" }
    ],
    "lastControlledBy": "USER"
  },
  {
    "name": "Kitchen Exhaust Fan",
    "type": "AC",
    "status": "OFF",
    "location": "Kitchen",
    "automations": [
      { "sensorType": "gas", "threshold": 55, "condition": "GREATER_THAN", "action": "ON" }
    ],
    "lastControlledBy": "USER"
  },
  {
    "name": "Living Room Smart Plug",
    "type": "COFFEE_MACHINE",
    "status": "OFF",
    "location": "Living Room",
    "automations": [
      { "sensorType": "motion", "threshold": 0, "condition": "EQUALS", "action": "OFF" },
      { "sensorType": "light", "threshold": 100, "condition": "LESS_THAN", "action": "OFF" }
    ],
    "lastControlledBy": "USER"
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-office';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding.');

    const args = process.argv.slice(2);
    const shouldDelete = args.includes('--delete');
    const shouldImport = args.includes('--import');

    if (shouldDelete) {
      console.log('Deleting existing data...');
      await Sensor.deleteMany({});
      await Device.deleteMany({});
      console.log('Existing data deleted.');
    }

    if (shouldImport || (!shouldDelete && await Sensor.countDocuments() === 0 && await Device.countDocuments() === 0)) {
      console.log('Seeding database...');
      
      const createdDevices = await Device.insertMany(devicesData);
      console.log(`${createdDevices.length} devices inserted.`);

      // Assign device IDs to sensors before inserting
      const sensorsToCreate = sensorsData.map(sensor => {
        let device;
        if (sensor.type === 'temperature' || sensor.type === 'humidity' || sensor.type === 'sound') {
          device = createdDevices.find(d => d.location === 'Living Room' && d.type === 'AC');
        } else if (sensor.type === 'light') {
          device = createdDevices.find(d => d.location === 'Office');
        } else if (sensor.type === 'motion') {
          device = createdDevices.find(d => d.location === 'Hallway');
        } else if (sensor.type === 'gas') {
          device = createdDevices.find(d => d.location === 'Kitchen');
        }
        return { ...sensor, device: device ? device._id : null };
      });

      const createdSensors = await Sensor.insertMany(sensorsToCreate);
      console.log(`${createdSensors.length} sensors inserted and linked.`);

      console.log('Database seeded successfully.');
    } else {
      console.log('Database is not empty and --import flag not used. Skipping seed process.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDB();