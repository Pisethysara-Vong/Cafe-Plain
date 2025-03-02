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

export {initializeFirebase};