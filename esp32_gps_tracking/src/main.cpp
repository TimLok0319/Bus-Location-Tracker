#include <Arduino.h>
#include <TinyGPS++.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>


// --Pin definition--
#define GPS_RX_PIN 16
#define GPS_TX_PIN 17

//-- WiFi Credentials --
const char* WifiName = "ESP32_Testing";// wifi name
const char* WifiPassword = "12345678"; // password

//-- Server details --
String URL = "URL";
String ApiKey ="APIKEY";

//-- Create TinyGPS++ object --
TinyGPSPlus GPS;

//-- Function prototypes --
void connectToWiFi();
void uploadData();

//tim
const unsigned long UPLOAD_INTERVAL = 30000; // Upload data every 30 seconds
unsigned long previousUploadTime = 0;



void setup() {

  Serial.begin(115200);// monitor serial
  Serial2.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN); // GPS module serial
  connectToWiFi();
}

void loop() {
  // This part constantly reads from the GPS module
  while (Serial2.available() > 0) {
    GPS.encode(Serial2.read());
  }

  if (millis() - previousUploadTime > UPLOAD_INTERVAL) {
    // Check if WiFi is still connected, if not, reconnect.
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi disconnected. Reconnecting...");
      connectToWiFi();
    }
 // Check if have a valid fix before trying to upload
    if (GPS.location.isValid() && GPS.date.isValid() && GPS.time.isValid()) {
      Serial.println("Valid data found. Preparing to upload...");
      uploadData();
      previousUploadTime = millis(); // Reset the timer
    } else {
      Serial.println("No valid GPS fix yet. Waiting...");
      // We don't reset the timer here, so it will try again soon
    }
  }
}


void connectToWiFi(){
  Serial.print("Connecting to ");
  Serial.println(WifiName);
  WiFi.begin(WifiName, WifiPassword);

  int tryCount = 0;
  while (WiFi.status() != WL_CONNECTED && tryCount < 20) { // Try to connect for 10 seconds
    delay(500);
    Serial.print(".");
    tryCount++;
  }
 if(WiFi.status() == WL_CONNECTED){
    Serial.println("\nWiFi connected.");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
  }
  else {
    Serial.println("\nFailed to connect to WiFi.");
  }
}


void uploadData(){
  if(WiFi.status() != WL_CONNECTED){
    Serial.println("WiFi not connected. Cannot upload data.");
    return;
  }
  StaticJsonDocument<256> jsonDoc;
  jsonDoc["longitude"] = GPS.location.lng();
  jsonDoc["latitude"] = GPS.location.lat();
  char gpsDate[11];
  sprintf(gpsDate, "%02d/%02d/%04d", GPS.date.day(), GPS.date.month(), GPS.date.year());
  jsonDoc["date"] = gpsDate;
  char gpsTime[9];
  sprintf(gpsTime, "%02d:%02d:%02d", GPS.time.hour(), GPS.time.minute(), GPS.time.second());
  jsonDoc["time"] = gpsTime;

  String dataToSend;
  serializeJson(jsonDoc, dataToSend);
  
  Serial.println("Uploading data: " + dataToSend);
  HTTPClient http;
  http.begin(URL+ApiKey); // Specify the request destination
  http.addHeader("Content-Type", "application/json"); // Specify content-type header
  int httpResponseCode = http.POST(dataToSend); // Send the request
  if(httpResponseCode > 0){
    String response = http.getString(); // Get the response to the request
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("Response from server: " + response);
  } else {
    Serial.println("Error on sending POST: " + String(httpResponseCode));
  }
}


