import React, { useState, useEffect } from 'react';
import DeviceCard from '../components/DeviceCard';
import { getAllDevices, updateDeviceStatus, addDevice } from '../services/api';
import './Devices.css';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState('');
  const [newDeviceStatus, setNewDeviceStatus] = useState('');
  const [newDeviceSensorType, setNewDeviceSensorType] = useState('');
  const [newDeviceCondition, setNewDeviceCondition] = useState('');
  const [newDeviceThreshold, setNewDeviceThreshold] = useState('');
  const [newDeviceAction, setNewDeviceAction] = useState('');
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDevices();
    const intervalId = setInterval(fetchDevices, 10000); // Fetch every 10 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await getAllDevices();
      if (data && Array.isArray(data.devices)) {
        setDevices(data.devices);
      } else {
        setDevices([]);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]);
      setError('Failed to fetch devices.');
    }
  };

  const handleToggle = async (deviceId, currentStatus) => {
    const newStatus = currentStatus.toLowerCase() === 'on' ? 'ON' : 'OFF'; // Compare in lowercase, send uppercase to backend
    // console.log(`Toggling device ${deviceId} to ${newStatus}`);
    try {
      await updateDeviceStatus(deviceId, newStatus);
      fetchDevices(); // Re-fetch devices to update the list
    } catch (error) {
      console.error('Error updating device status:', error);
      setError('Failed to update device status.');
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const automations = [];
    if (newDeviceSensorType && newDeviceCondition && newDeviceThreshold && newDeviceAction) {
      automations.push({
        sensorType: newDeviceSensorType,
        condition: newDeviceCondition,
        threshold: parseFloat(newDeviceThreshold),
        action: newDeviceAction,
      });
    }

    const deviceData = {
      name: newDeviceName,
      type: newDeviceType,
      status: newDeviceStatus,
      automations: automations,
    };

    try {
      const data = await addDevice(deviceData);
      if (data._id) {
        setMessage('Device added successfully!');
        setNewDeviceName('');
        setNewDeviceType('');
        setNewDeviceStatus('');
        setNewDeviceSensorType('');
        setNewDeviceCondition('');
        setNewDeviceThreshold('');
        setNewDeviceAction('');
        setShowAddDeviceForm(false);
        fetchDevices(); // Re-fetch devices to update the list
      } else {
        setError(data.message || 'Failed to add device.');
      }
    } catch (error) {
      console.error('Error adding device:', error);
      setError('Network error or server unavailable.');
    }
  };

  return (
    <div className="devices-container">
      <header className="devices-header">
        <h1>Smart Office Devices</h1>
        <button onClick={() => setShowAddDeviceForm(!showAddDeviceForm)} className="add-device-button">
          {showAddDeviceForm ? 'Hide Form' : 'Add New Device'}
        </button>
      </header>

      {showAddDeviceForm && (
        <div className="add-device-form-container">
          <h3>Add New Device</h3>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleAddDevice} className="add-device-form">
            <div className="form-group">
              <label htmlFor="deviceName">Device Name:</label>
              <input
                type="text"
                id="deviceName"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="deviceType">Device Type:</label>
              <input
                type="text"
                id="deviceType"
                value={newDeviceType}
                onChange={(e) => setNewDeviceType(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="deviceStatus">Initial Status:</label>
              <select
                id="deviceStatus"
                value={newDeviceStatus}
                onChange={(e) => setNewDeviceStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>
            <h4>Automation Rule (Optional)</h4>
            <div className="form-group">
              <label htmlFor="sensorType">Sensor Type:</label>
              <input
                type="text"
                id="sensorType"
                value={newDeviceSensorType}
                onChange={(e) => setNewDeviceSensorType(e.target.value)}
                placeholder="e.g., temperature, light"
              />
            </div>
            <div className="form-group">
              <label htmlFor="condition">Condition:</label>
              <select
                id="condition"
                value={newDeviceCondition}
                onChange={(e) => setNewDeviceCondition(e.target.value)}
              >
                <option value="">Select Condition</option>
                <option value="GREATER_THAN">Greater Than</option>
                <option value="LESS_THAN">Less Than</option>
                <option value="EQUALS">Equals</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="threshold">Threshold:</label>
              <input
                type="number"
                id="threshold"
                value={newDeviceThreshold}
                onChange={(e) => setNewDeviceThreshold(e.target.value)}
                placeholder="e.g., 25, 500"
              />
            </div>
            <div className="form-group">
              <label htmlFor="action">Action (Device Status):</label>
              <select
                id="action"
                value={newDeviceAction}
                onChange={(e) => setNewDeviceAction(e.target.value)}
              >
                <option value="">Select Action</option>
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>
            <button type="submit" className="submit-button">Add Device</button>
          </form>
        </div>
      )}

      <main className="device-grid">
        {devices.length > 0 ? (
          devices.map(device => (
            <DeviceCard
              key={device._id}
              device={device}
              onToggle={handleToggle}
            />
          ))
        ) : (
          <p>No devices found. Add a new device to get started!</p>
        )}
      </main>
    </div>
  );
};

export default Devices;