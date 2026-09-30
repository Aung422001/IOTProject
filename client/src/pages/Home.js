import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const FEATURES = [
  {
    icon: '🔌',
    title: 'Device Management',
    description: 'Register, monitor, and toggle smart devices in real time from a single control panel.',
  },
  {
    icon: '📡',
    title: 'Live Sensor Monitoring',
    description: 'Track temperature, humidity, light, and other sensor readings as they update continuously.',
  },
  {
    icon: '⚙️',
    title: 'Rule-Based Automation',
    description: 'Define threshold-based rules so devices react automatically to changing sensor conditions.',
  },
  {
    icon: '🔐',
    title: 'Secure Authentication',
    description: 'JWT-based signup and login keeps every device and sensor endpoint protected.',
  },
  {
    icon: '🧭',
    title: 'User Override & Pause',
    description: 'Manual changes take priority over automation, with a smart cooldown to avoid conflicts.',
  },
  {
    icon: '🌗',
    title: 'Light & Dark Theme',
    description: 'A fully themed interface that adapts to your preference across every page.',
  },
];

const STACK = [
  { group: 'Frontend', items: ['React', 'React Router'] },
  { group: 'Backend', items: ['Node.js', 'Express'] },
  { group: 'Database', items: ['MongoDB', 'Mongoose'] },
  { group: 'Auth & Security', items: ['JSON Web Tokens', 'bcryptjs'] },
];

const STEPS = [
  {
    step: '01',
    title: 'Sensors report readings',
    description: 'A background simulator (or real hardware) continuously updates sensor values.',
  },
  {
    step: '02',
    title: 'Automation engine evaluates rules',
    description: 'Each update is checked against device automation rules (greater than, less than, equals).',
  },
  {
    step: '03',
    title: 'Devices respond automatically',
    description: 'Matching devices switch state instantly, while user overrides always take priority.',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="home-hero">
        <span className="home-hero-badge">IoT Project Showcase</span>
        <h1>Smart Office Control System</h1>
        <p className="home-hero-subtitle">
          A full-stack IoT platform for monitoring sensors, controlling smart devices,
          and automating an office environment in real time.
        </p>
        <div className="home-hero-actions">
          {isAuthenticated ? (
            <Link to="/devices" className="home-btn home-btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/signup" className="home-btn home-btn-primary">Get Started</Link>
              <Link to="/login" className="home-btn home-btn-secondary">Login</Link>
            </>
          )}
        </div>
        <div className="home-hero-badges">
          {STACK.flatMap((group) => group.items).map((item) => (
            <span key={item} className="home-tech-pill">{item}</span>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 className="home-section-title">What it does</h2>
        <div className="home-features-grid">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="home-feature-card">
              <div className="home-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 className="home-section-title">How it works</h2>
        <div className="home-steps">
          {STEPS.map((item) => (
            <div key={item.step} className="home-step-card">
              <span className="home-step-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 className="home-section-title">Built with</h2>
        <div className="home-stack-grid">
          {STACK.map((group) => (
            <div key={group.group} className="home-stack-group">
              <h4>{group.group}</h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <h2>See it in action</h2>
        <p>Create an account to add devices, register sensors, and watch automation run live.</p>
        {isAuthenticated ? (
          <Link to="/devices" className="home-btn home-btn-primary">Open Dashboard</Link>
        ) : (
          <Link to="/signup" className="home-btn home-btn-primary">Create a Free Account</Link>
        )}
      </section>
    </div>
  );
};

export default Home;
