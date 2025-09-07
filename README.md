**Campus Bus GPS Tracker**

A smart tracking system that provides real-time bus location visibility for students and staff via a web dashboard, using ESP32, GPS module, and IoT integration.

✅ Problem Statement

Students and staff often wait without knowing the exact location of campus buses, leading to wasted time and frustration. The lack of real-time visibility on bus positions reduces convenience and efficiency on campus.

✅ Proposed Solution

This project solves the problem by providing:

-Real-time bus location tracking using ESP32 and GPS.

-Cloud-based data storage (API/Firebase) for accessibility.

-A web dashboard to display the current bus position on a map.

-Future features such as ETA predictions, notifications, and AI-based optimizations.

*Task Division
We had divided our project into four main component:
Hardware, FrontEnd, Database and Backend.

------------------------------------------------Database-----------------------------------------------------

API Documentation for Live Bus Tracker

Database: Firebase Realtime Database
Database URL: https://bus-location-tracker-62f5e-default-rtdb.asia-southeast1.firebasedatabase.app/.json
---

JSON Data Structure

The bus location data is stored under the buses/bus_01 path with the following JSON format:
{
  "date": "05/09/2025",
  "latitude": 5.3364,
  "longitude": 100.3067,
  "time": "15:30:00"
}

---

ESP32 to Database (Data Transmission)

~Method: PATCH or PUT
~Endpoint: https://bus-location-tracker-62f5e-default-rtdb.asia-southeast1.firebasedatabase.app/buses/bus_01.json
~Request Body (JSON): The firmware should send a JSON payload that matches the structure above. 
 For example:
 {
  "latitude": 5.3364,
  "longitude": 100.3067,
  "date": "05/09/2025",
  "time": "15:30:00"
}

---

Web Dashboard to Database (Data Retrieval)

~The dashboard uses the Firebase JavaScript SDK.
~It listens for real-time updates on the buses/bus_01 database path.
~The code retrieves the latitude and longitude fields to display the bus's location on the map.

------------------------------------------------Front End-----------------------------------------------------

**Web Dashboard**
A simple frontend prototype that uses the Google Maps JavaScript API to simulate live bus tracking, ETA calculation, and routing between bus stops.


<img width="437" height="757" alt="image" src="https://github.com/user-attachments/assets/c1ddb2ae-4587-4935-9454-d5ea445ec7d9" />

📌 Features
-Displays a bus marker that updates position every 3 seconds.
-Bus stops are marked on the map.
-The next stop name is shown in a card.
-The ETA to the next stop is calculated using Google Maps Directions API.
-Routes can include waypoints for more realistic paths.

🗺️ How It Works
*index.html
Loads the map container and a card for bus info.
Connects to script.js and Google Maps API.

*script.js
Initializes the map with a bus marker and bus stop markers.
Calls updateBus() every 3 seconds.
Fetches the latest bus position (dummy JSON endpoint for now).
Updates the bus marker, redraws the route, and updates ETA in the card.


