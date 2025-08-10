import React, { useState } from 'react';
import './SensorCard.css';

const SensorCard = ({ sensor, onUpdateValue }) => {
  const [newValue, setNewValue] = useState(sensor.value);

  const handleValueChange = (e) => {
    setNewValue(e.target.value);
  };

  const handleUpdateClick = () => {
    onUpdateValue(sensor._id, parseFloat(newValue));
  };

  return (
    <div className="sensor-card">
      <h3>{sensor.name}</h3>
      <p>Type: {sensor.type}</p>
      <p>Current Value: <span className="sensor-value">{sensor.value}</span></p>
      <div className="sensor-update-section">
        <input
          type="number"
          value={newValue}
          onChange={handleValueChange}
          placeholder="New Value"
        />
        <button onClick={handleUpdateClick} className="update-sensor-button">
          Update Value
        </button>
      </div>
    </div>
  );
};

export default SensorCard;