// Firebase Configuration
// This file contains the Firebase project settings and initialization

const firebaseConfig = {
  apiKey: "AIzaSyCEyaumHFJTJFtan3w7-ZlBiQQZL27NKuE",
  authDomain: "tup-sit-app.firebaseapp.com",
  projectId: "tup-sit-app",
  storageBucket: "tup-sit-app.firebasestorage.app",
  messagingSenderId: "385613559267",
  appId: "1:385613559267:web:c59e7773479ed41d515cd6",
  measurementId: "G-1VHYWC64GM",
};

// Global variables for Firebase services
let auth = null;
let db = null;

// Initialize Firebase
function initializeFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  auth = firebase.auth();
  db = firebase.firestore();

  // FIX: Forces Firebase to use HTTP Long Polling instead of WebSockets.
  // This stops the "Connection Closed" errors and the continuous network spam
  // that happens when iframes or strict networks block WebSocket connections.
  // db.settings({ experimentalForceLongPolling: true });
}
