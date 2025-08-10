# Project: Smart Office Server

This project is the backend for a Smart Office Control System. It provides a RESTful API for managing users, sensors, and devices, enabling automated control based on real-time sensor data.

## Key Features

-   **User Authentication:** Secure user signup and login using JSON Web Tokens (JWTs).
-   **Device Management:** Authenticated users can add, view, and update the status of smart devices.
-   **Sensor Data Handling:** Manage various sensor types and their real-time data.
-   **Automated Control:** The system automatically controls devices based on predefined rules and live sensor readings.

## System Automation

The server incorporates a robust automation system that reacts to sensor data to control devices. This includes a background simulation for realistic testing and a core logic for real-time device adjustments.

1.  **Sensor Simulation (`lib/sensorSimulator.js`)**:
    *   A background process periodically fetches all registered sensors from the database.
    *   It generates realistic random values for each sensor (e.g., temperature, humidity, light intensity).
    *   The sensor's `value` in the database is updated. This update is crucial as it triggers the automation logic.
    *   Changes are logged to the console for monitoring.

2.  **Automation Logic (`lib/automations.js`)**:
    *   Immediately after a sensor's value is updated (either via simulation or a direct API call), the system invokes the `checkAutomations` function.
    *   This function identifies all devices that have automation rules linked to the updated sensor's type (e.g., a light device automated by a `light` sensor).
    *   For each relevant device, it evaluates the defined automation conditions (`GREATER_THAN`, `LESS_THAN`, `EQUALS`) against the sensor's new value.
    *   If a condition is met and the device's current status differs from the automation's specified action, the device's status is automatically updated in the database.
    *   A confirmation message is logged to the console for every automated device status change, providing clear visibility into the system's behavior.

This integrated process ensures that the smart office environment dynamically responds to changing conditions without manual intervention.

## Tech Stack

-   **Backend:** Node.js with Express.js
-   **Database:** MongoDB with Mongoose
-   **Authentication:** `bcryptjs` for password hashing and `jsonwebtoken` for JWTs
-   **Middleware:** `cors` for enabling Cross-Origin Resource Sharing and `morgan` for logging HTTP requests.

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication (`/api/auth`)

These routes handle user registration and login. They do **not** require authentication.

-   `POST /api/auth/signup`: Registers a new user account.
    *   **Request Body:** `{ "email": "string", "password": "string" }`
    *   **Response:** `{ "message": "User registered successfully" }` or error.
-   `POST /api/auth/login`: Authenticates a user and returns a JSON Web Token (JWT).
    *   **Request Body:** `{ "email": "string", "password": "string" }`
    *   **Response:** `{ "token": "your_jwt_token" }` or error.

### Devices (`/api/devices`)

These routes manage smart devices. All device-related endpoints are protected by the `protect` middleware, requiring a valid JWT in the `Authorization: Bearer <token>` header.

-   `POST /api/devices`: Adds a new device.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** `{ "name": "string", "type": "string", "status": "string", "automations": [{ "sensorType": "string", "condition": "string", "threshold": "number", "action": "string" }] }`
    *   **Response:** The newly created device object.
-   `GET /api/devices`: Retrieves a list of all registered devices.
    *   **Authentication:** Required (JWT)
    *   **Response:** An array of device objects. The `automations` field is hidden for security.
-   `GET /api/devices/:id`: Retrieves a specific device by its ID.
    *   **Authentication:** Required (JWT)
    *   **Response:** A single device object. The `automations` field is hidden for security.
-   `PATCH /api/devices/:id/status`: Updates the status of a specific device.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** `{ "status": "string" }`
    *   **Response:** The updated device object.

### Sensors (`/api/sensors`)

These routes manage sensors. All sensor-related endpoints are protected by the `protect` middleware, requiring a valid JWT in the `Authorization: Bearer <token>` header.

-   `POST /api/sensors`: Adds a new sensor.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** `{ "name": "string", "type": "string", "value": "number" }`
    *   **Response:** The newly created sensor object.
-   `GET /api/sensors`: Retrieves a list of all registered sensors.
    *   **Authentication:** Required (JWT)
    *   **Response:** An array of sensor objects.
-   `GET /api/sensors/:id`: Retrieves a specific sensor by its ID.
    *   **Authentication:** Required (JWT)
    *   **Response:** A single sensor object.
-   `PATCH /api/sensors/:id`: Updates the value of a specific sensor. This is the endpoint that triggers automation checks.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** `{ "value": "number" }`
    *   **Response:** The updated sensor object.

## Authentication Protection (`middleware/authMiddleware.js`)

The `protect` middleware is responsible for authenticating requests. It performs the following steps:

1.  **Checks for Token:** It looks for a JWT in the `Authorization` header of the incoming request. The token is expected to be in the format `Bearer <token>`.
2.  **Verifies Token:** If a token is found, it attempts to verify the token's authenticity using a predefined secret key.
3.  **Attaches User:** If the token is valid, it decodes the user ID from the token, fetches the corresponding user from the database (excluding their password), and attaches the user object to the `req.user` property.
4.  **Proceeds or Denies:** If authentication is successful, the request proceeds to the next middleware or route handler. If no token is found, the token is invalid, or the user cannot be found, it sends a `401 Unauthorized` response.

## Getting Started

(Instructions on how to set up and run the project would go here, e.g., `npm install`, `npm start`, database setup, etc.)