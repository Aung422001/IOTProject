const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const deviceRoutes = require('./routes/deviceRoutes');
const userRoutes = require('./routes/userRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const { startSimulation } = require('./lib/sensorSimulator');
const Sensor = require('./models/Sensor');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const mongoURI = process.env.MONGO_URI

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api/auth', userRoutes);
app.use('/api', deviceRoutes);
app.use('/api', sensorRoutes);

const PORT = process.env.PORT || 5000;

// Start sensor simulation
startSimulation();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 