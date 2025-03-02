// frontend/firebase-app.js
async function initializeFirebase() {
    // Fetch Firebase config from the deployed backend
    const response = await fetch('/api/firebase-config');
    const firebaseConfig = await response.json();

    // Return the Firebase config
    return firebaseConfig;
}

export {initializeFirebase};