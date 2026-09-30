import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home'; // Public project showcase page
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './ProtectedRoute';
import Devices from './pages/Devices'; // New component for device listing
import Sensors from './pages/Sensors'; // New component for sensor listing

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
          <Route path="/sensors" element={<ProtectedRoute><Sensors /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 