import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyCJVzvz6-X-VFAqpf8AoZ9scl9iXWzaK7w",
    authDomain: "cafe-plain.firebaseapp.com",
    projectId: "cafe-plain",
    storageBucket: "cafe-plain.firebasestorage.app",
    messagingSenderId: "590173429316",
    appId: "1:590173429316:web:dc4ba8bdbcee1ac32a2611",
    measurementId: "G-D1JDZZ9TZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function checkUserSession() {
    const account = document.getElementById('account');
    const sign_in = document.getElementById('sign-in');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            sign_in.style.display = "none";
        }
        else {
            account.style.display = "none";
        }
    });
}

document.addEventListener('DOMContentLoaded', checkUserSession);

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth)
                .then(() => {
                    window.location.href = "/Brocode/CafeShop/HomePage/home.html";
                })
                .catch((error) => {
                    console.error("Error signing out:", error.message);
                });
        });
    }
});