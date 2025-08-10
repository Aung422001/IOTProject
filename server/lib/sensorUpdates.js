const Sensor = require('../models/Sensor');
const { checkAutomations } = require('./automations');

const updateSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    const sensor = await Sensor.findById(id);

    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found' });
    }

    sensor.value = value;
    sensor.updatedAt = Date.now();
    await sensor.save();

    await checkAutomations(sensor);

    res.json(sensor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateSensor };
