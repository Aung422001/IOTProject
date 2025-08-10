const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const getAllDevices = async () => {
  const response = await fetch(`${API_BASE_URL}/devices`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const addDevice = async (deviceData) => {
  const response = await fetch(`${API_BASE_URL}/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(deviceData),
  });
  return response.json();
};

export const updateDeviceStatus = async (deviceId, status) => {
  const response = await fetch(`${API_BASE_URL}/devices/${deviceId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
};

export const getAllSensors = async () => {
  const response = await fetch(`${API_BASE_URL}/sensors`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const addSensor = async (sensorData) => {
  const response = await fetch(`${API_BASE_URL}/sensors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(sensorData),
  });
  return response.json();
};

export const updateSensorValue = async (sensorId, value) => {
  const response = await fetch(`${API_BASE_URL}/sensors/${sensorId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ value }),
  });
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}; 