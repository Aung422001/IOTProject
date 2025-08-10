# Frontend Implementation Plan: Smart Office Control System

This document outlines the plan for developing the frontend application for the Smart Office Control System, based on the provided backend API documentation.

## Part 1: Core Structure & Authentication

This section focuses on setting up the foundational elements of the frontend, including user authentication and secure routing.

1.  **Login Page (`src/pages/Login.js`, `src/pages/Login.css`):**
    *   Implement a form for username and password input.
    *   On submission, call `POST /api/auth/login` using `src/services/api.js`.
    *   Store the received JWT in `localStorage` upon successful login.
    *   Redirect to the dashboard or device management page.
    *   Handle login errors (e.g., invalid credentials).
2.  **Signup Page (`src/pages/Signup.js`, `src/pages/Signup.css`):**
    *   Implement a form for username and password input.
    *   On submission, call `POST /api/auth/signup` using `src/services/api.js`.
    *   Display a success message or redirect to the login page.
    *   Handle signup errors (e.g., username already exists).
3.  **Authentication Context (`src/contexts/AuthContext.js`):**
    *   Create a React Context to manage authentication state (e.g., `isLoggedIn`, `user`, `token`).
    *   Provide functions for `login`, `logout`, and `signup`.
    *   Integrate with `localStorage` to persist the JWT.
4.  **Protected Routes (`src/ProtectedRoute.js`):**
    *   Utilize the `AuthContext` to protect routes that require authentication (e.g., device management, sensor management).
    *   Redirect unauthenticated users to the login page.
5.  **Navigation Bar (`src/components/Navbar.js`):**
    *   Display different navigation links based on authentication status (e.g., "Login", "Signup" vs. "Devices", "Sensors", "Logout").
    *   Implement a logout function that clears the JWT from `localStorage` and updates the `AuthContext`.
6.  **API Service (`src/services/api.js`):**
    *   Configure `axios` (or `fetch`) to include the JWT in the `Authorization` header for all authenticated requests.
    *   Create helper functions for each API endpoint (e.g., `loginUser`, `signupUser`, `getDevices`, `addDevice`, `updateDeviceStatus`, `getSensors`, `addSensor`, `updateSensorValue`).

## Part 2: Device Management

This part focuses on implementing the core functionality for managing smart devices within the system.

1.  **Device Dashboard/Listing Page (New Page: `src/pages/Devices.js`):**
    *   Fetch and display a list of devices using `GET /api/devices`.
    *   Use `src/components/DeviceCard.js` to render individual device information.
2.  **Device Card Component (`src/components/DeviceCard.js`, `src/components/DeviceCard.css`):**
    *   Display device name, type, and current status.
    *   Implement a mechanism to update device status (e.g., a toggle switch or button) using `PATCH /api/devices/:id/status`.
3.  **Add Device Page/Modal (New Component/Page: `src/components/AddDevice.js` or `src/pages/AddDevice.js`):**
    *   Implement a form to add a new device using `POST /api/devices`.
    *   Include fields for `name`, `type`, `status`, and `automations`. The `automations` field will be complex, potentially requiring dynamic form fields for `sensorType`, `condition`, `threshold`, and `action`. For initial implementation, we can simplify or omit automations if it's too complex for an automatic implementation.

## Part 3: Styling, Layout, Routing & Sensor Management (Optional)

This final part covers the overall look and feel, navigation, and the optional implementation of sensor management.

1.  **Styling and Layout:**
    *   **Global Styles (`src/index.css`, `src/App.css`):** Define basic typography, colors, and layout.
    *   **Component-Specific Styles (`.css` files for each component/page):** Apply styles to individual components to match a modern, clean UI.
    *   **Footer (`src/components/Footer.jsx`, `src/components/Footer.css`):** Ensure the existing footer is integrated correctly.
2.  **Routing:**
    *   **React Router:** Configure `react-router-dom` to handle navigation between pages (Login, Signup, Devices, Sensors).
3.  **Sensor Management (Optional for initial implementation):**
    *   **Sensor Listing Page (New Page: `src/pages/Sensors.js`):** Fetch and display a list of sensors using `GET /api/sensors`. Display sensor name, type, and current value.
    *   **Add Sensor Page/Modal (New Component/Page: `src/components/AddSensor.js` or `src/pages/AddSensor.js`):** Implement a form to add a new sensor using `POST /api/sensors`. Include fields for `name`, `type`, and `value`.
    *   **Update Sensor Value (Directly on listing page or dedicated component):** Implement a mechanism to update sensor value using `PATCH /api/sensors/:id`.
