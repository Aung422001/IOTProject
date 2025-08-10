import React, { useState, useEffect } from 'react';
import { getAllSensors, addSensor, updateSensorValue } from '../services/api';
import SensorCard from '../components/SensorCard'; // We will create this component
import './Sensors.css';

const Sensors = () => {
  const [sensors, setSensors] = useState([]);
  const [newSensorName, setNewSensorName] = useState('');
  const [newSensorType, setNewSensorType] = useState('');
  const [newSensorValue, setNewSensorValue] = useState('');
  const [showAddSensorForm, setShowAddSensorForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSensors();
    const intervalId = setInterval(fetchSensors, 10000); // Fetch every 10 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const fetchSensors = async () => {
    try {
      const data = await getAllSensors();
      console.log('Fetched sensors:', data.sensors);
      if (data.sensors && Array.isArray(data.sensors)) {
        setSensors(data.sensors);
      } else {
        setSensors([]);
      }
    } catch (error) {
      console.error('Error fetching sensors:', error);
      setSensors([]);
      setError('Failed to fetch sensors.');
    }
  };

  const handleUpdateSensorValue = async (sensorId, newValue) => {
    try {
      await updateSensorValue(sensorId, newValue);
      fetchSensors(); // Re-fetch sensors to update the list
    } catch (error) {
      console.error('Error updating sensor value:', error);
      setError('Failed to update sensor value.');
    }
  };

  const handleAddSensor = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const sensorData = {
      name: newSensorName,
      type: newSensorType,
      value: parseFloat(newSensorValue),
    };

    try {
      const data = await addSensor(sensorData);
      if (data._id) {
        setMessage('Sensor added successfully!');
        setNewSensorName('');
        setNewSensorType('');
        setNewSensorValue('');
        setShowAddSensorForm(false);
        fetchSensors(); // Re-fetch sensors to update the list
      } else {
        setError(data.message || 'Failed to add sensor.');
      }
    } catch (error) {
      console.error('Error adding sensor:', error);
      setError('Network error or server unavailable.');
    }
  };

  return (
    <div className="sensors-container">
      <header className="sensors-header">
        <h1>Smart Office Sensors</h1>
        <button onClick={() => setShowAddSensorForm(!showAddSensorForm)} className="add-sensor-button">
          {showAddSensorForm ? 'Hide Form' : 'Add New Sensor'}
        </button>
      </header>

      {showAddSensorForm && (
        <div className="add-sensor-form-container">
          <h3>Add New Sensor</h3>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleAddSensor} className="add-sensor-form">
            <div className="form-group">
              <label htmlFor="sensorName">Sensor Name:</label>
              <input
                type="text"
                id="sensorName"
                value={newSensorName}
                onChange={(e) => setNewSensorName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sensorType">Sensor Type:</label>
              <input
                type="text"
                id="sensorType"
                value={newSensorType}
                onChange={(e) => setNewSensorType(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sensorValue">Initial Value:</label>
              <input
                type="number"
                id="sensorValue"
                value={newSensorValue}
                onChange={(e) => setNewSensorValue(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">Add Sensor</button>
          </form>
        </div>
      )}

      <main className="sensor-grid">
        {sensors.length > 0 ? (
          sensors.map(sensor => (
            <SensorCard
              key={sensor._id}
              sensor={sensor}
              onUpdateValue={handleUpdateSensorValue}
            />
          ))
        ) : (
          <p>No sensors found. Add a new sensor to get started!</p>
        )}
      </main>
    </div>
  );
};

export default Sensors;