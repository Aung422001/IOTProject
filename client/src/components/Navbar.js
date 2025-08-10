import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div className=" navbar-themed-container">
          <nav className="navbar navbar-expand-lg navbar-themed">
            <div className="container-fluid">
              <Link className="navbar-brand navbar-brand-themed" to="/">Smart Office</Link>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link nav-link-themed" to="/">Home</Link>
                  </li>
                  {isAuthenticated ? (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link nav-link-themed" to="/devices">Devices</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link nav-link-themed" to="/sensors">Sensors</Link>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link btn btn-link btn-link-themed" onClick={handleLogout}>Logout</button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link nav-link-themed" to="/login">Login</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link nav-link-themed" to="/signup">Signup</Link>
                      </li>
                    </>
                  )}
                </ul>
                <div className="form-check form-switch ms-auto">
                  <input
                    className="form-check-input" 
                    type="checkbox" 
                    id="darkModeSwitch"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <label class='text-white' htmlFor="darkModeSwitch">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </label>
                </div>
              </div>
            </div>
          </nav>
        </div>
    </>
  );
};

export default Navbar;




