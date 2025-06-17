/* ESP32 Firebase 5-LED Control
 * Controls 5 LEDs based on Firebase database status
 * Single ESP32 controls light1, light2, light3, light4, light5
 */

#include <FirebaseESP32.h>
#include <WiFi.h>

// Replace with your network credentials
#define WIFI_SSID "Nothing 2a"
#define WIFI_PASSWORD "dharshini08"

// Replace with your Firebase project details
#define DATABASE_URL "https://home-automation-55d2d-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define API_KEY "AIzaSyAsZtVtrdNwji0EBu1x_qDSXiL84QlYqBE"

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// LED Pin Configuration
#define LED1_PIN 2   // GPIO 2 for light1
#define LED2_PIN 4   // GPIO 4 for light2
#define LED3_PIN 5   // GPIO 5 for light3
#define LED4_PIN 18  // GPIO 18 for light4
#define LED5_PIN 19  // GPIO 19 for light5

// Variables to track LED states
String lastLight1Status = "";
String lastLight2Status = "";
String lastLight3Status = "";
String lastLight4Status = "";
String lastLight5Status = "";

void setup() {
  Serial.begin(115200);
  
  // Initialize LED pins
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(LED4_PIN, OUTPUT);
  pinMode(LED5_PIN, OUTPUT);
  
  // Start with all LEDs OFF
  digitalWrite(LED1_PIN, LOW);
  digitalWrite(LED2_PIN, LOW);
  digitalWrite(LED3_PIN, LOW);
  digitalWrite(LED4_PIN, LOW);
  digitalWrite(LED5_PIN, LOW);
  
  Serial.println("ESP32 5-LED Firebase Control");
  Serial.println("LED1 -> GPIO 2");
  Serial.println("LED2 -> GPIO 4");
  Serial.println("LED3 -> GPIO 5");
  Serial.println("LED4 -> GPIO 18");
  Serial.println("LED5 -> GPIO 19");
  
  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi.");
  
  // Initialize Firebase
  config.signer.tokens.legacy_token = API_KEY;
  config.host = DATABASE_URL;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Wait for Firebase to be ready
  unsigned long startMillis = millis();
  while (!Firebase.ready() && millis() - startMillis < 10000) {
    delay(500);
    Serial.print(".");
  }

  if (Firebase.ready()) {
    Serial.println("\nFirebase is ready!");
  } else {
    Serial.println("\nFirebase initialization failed!");
  }
  
  Serial.println("5-LED Control System Started");
}

void loop() {
  // Check all 5 lights from Firebase
  checkAllLights();
  
  // Wait before next check
  delay(2000);  // Check every 2 seconds
}

void checkAllLights() {
  if (Firebase.ready()) {
    // Check Light 1
    checkLight("light1", LED1_PIN, lastLight1Status);
    
    // Check Light 2
    checkLight("light2", LED2_PIN, lastLight2Status);
    
    // Check Light 3
    checkLight("light3", LED3_PIN, lastLight3Status);
    
    // Check Light 4
    checkLight("light4", LED4_PIN, lastLight4Status);
    
    // Check Light 5
    checkLight("light5", LED5_PIN, lastLight5Status);
  }
}

void checkLight(String lightName, int ledPin, String &lastStatus) {
  String firebasePath = "/devices/" + lightName;
  
  if (Firebase.getString(fbdo, firebasePath)) {
    String lightStatus = fbdo.stringData();
    lightStatus.toLowerCase(); // Convert to lowercase
    
    // Only process if status has changed
    if (lightStatus != lastStatus) {
      Serial.print(lightName + " status: ");
      Serial.println(lightStatus);
      
      if (lightStatus == "on") {
        // Turn LED ON
        digitalWrite(ledPin, HIGH);
        Serial.println(lightName + " LED turned ON");
      } else if (lightStatus == "off") {
        // Turn LED OFF
        digitalWrite(ledPin, LOW);
        Serial.println(lightName + " LED turned OFF");
      }
      
      lastStatus = lightStatus;
    }
  } else {
    Serial.print("Failed to read " + lightName + ": ");
    Serial.println(fbdo.errorReason());
  }
}