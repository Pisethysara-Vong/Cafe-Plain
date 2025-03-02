import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

async function initializeFirebase() {
    try {
        const response = await fetch('/api/firebase-config');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const firebaseConfig = await response.json();
        console.log("✅ Firebase Config:", firebaseConfig);
        return firebaseConfig;
    } catch (err) {
        console.error("🔥 Fetch Error:", err);
    }
}

async function initializeAppAndAuth() {
    const firebaseConfig = await initializeFirebase();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
}

export {initializeAppAndAuth};