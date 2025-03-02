// frontend/firebase-app.js
export async function initializeFirebase() {
    // Fetch Firebase config from the deployed backend
    const response = await fetch('/api/firebase-config.js');
    const firebaseConfig = await response.json();

    // Return the Firebase config
    return firebaseConfig;
}