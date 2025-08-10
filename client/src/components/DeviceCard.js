import React from 'react';
import './DeviceCard.css';

const DeviceCard = ({ device, onToggle }) => {
  return (
    <div className="device-card">
      <h3>{device.name}</h3>
      <p>Type: {device.type}</p>
      <p>Status: <span className={`status-${device.status.toLowerCase()}`}>{device.status}</span></p>
      <button 
        onClick={() => onToggle(device._id, device.status.toLowerCase() === 'on' ? 'OFF' : 'ON')}
        className={`toggle-btn ${device.status === 'on' ? 'on' : 'off'}`}
      >
        {device.status === 'ON' ? 'Turn Off' : 'Turn On'}
      </button>
    </div>
  );
};

export default DeviceCard;