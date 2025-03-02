import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {initializeFirebase} from "/firebaseConfig.js";


// Initialize Firebase
let app, auth;

async function initializeAppAndAuth() {
    const firebaseConfig = await initializeFirebase(); // Get the Firebase config
    app = initializeApp(firebaseConfig); // Initialize Firebase app
    auth = getAuth(app); // Initialize Firebase Auth
}

const form = document.getElementById('form');
const success_message = document.getElementById('success-messages');
const error_message = document.getElementById('error-messages');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!app || !auth) {
        await initializeAppAndAuth();
    }
    const email = document.getElementById('email').value;
    success_message.innerText = '';
    error_message.innerText = '';

    try {
        await sendPasswordResetEmail(auth, email);
        success_message.innerText = 'Password reset email sent! Check your inbox.';
    } catch (error) {
        console.error("Error resetting password:", error);
        if (error.code === 'auth/user-not-found') {
            error_message.innerText = 'No user found with this email.';
        } else if (error.code === 'auth/invalid-email') {
            error_message.innerText = 'Invalid email address.';
        } else {
            error_message.innerText = 'Error sending reset email. Try again later.';
        }
    }
});