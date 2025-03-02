export default function handler(req, res) {
    res.status(200).json({
        apiKey: process.env.FIREBASE_API_KEY || "Not found",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "Not found",
        projectId: process.env.FIREBASE_PROJECT_ID || "Not found",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "Not found",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "Not found",
        appId: process.env.FIREBASE_APP_ID || "Not found",
    });
}
