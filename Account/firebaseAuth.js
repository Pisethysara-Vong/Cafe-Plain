// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeFirebase } from "/firebaseConfig.js";

// Initialize Firebase
let app, auth, db;

async function initializeAppAndAuth() {
    const firebaseConfig = await initializeFirebase(); // Get the Firebase config
    app = initializeApp(firebaseConfig); // Initialize Firebase app
    auth = getAuth(app); // Initialize Firebase Auth
    db = getFirestore(app); // Initialize Firestore database

    // Set persistence
    await setPersistence(auth, browserLocalPersistence)
        .then(() => console.log("Firebase persistence set to local"))
        .catch((error) => console.error("Failed to set persistence:", error));
}

// DOM Elements
const form = document.getElementById('form');
const username_input = document.getElementById('username-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const confirm_password_input = document.getElementById('confirm-password-input');
const error_messages = document.getElementById('error-messages');


// Ensure Firebase is initialized before handling form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ensure Firebase is initialized
    if (!app || !auth || !db) {
        await initializeAppAndAuth();
    }

    let errors = [];

    if (username_input) {
        errors = getSignupFormErrors(username_input.value, email_input.value, password_input.value, confirm_password_input.value);
    } else {
        errors = getLoginFormErrors(email_input.value, password_input.value);
    }

    if (errors.length > 0) {
        error_messages.innerText = errors.join('\n');
    } else if (errors.length == 0 && username_input) {
        const userName = username_input.value;
        const email = email_input.value;
        const password = password_input.value;

        // Check if username already exists
        const usersRef = collection(db, "users"); // Reference to the "users" collection
        const usernameQuery = query(usersRef, where("username", "==", userName)); // Create a query to check username

        try {
            const querySnapshot = await getDocs(usernameQuery);
            if (!querySnapshot.empty) {
                // Username already exists
                error_messages.innerText = 'Username already exists';
                username_input.parentElement.classList.add('incorrect');
            } else {
                // Proceed with account creation
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Generate default profile picture with initials
                const initials = userName
                    .split(' ')
                    .map((name) => name[0].toUpperCase())
                    .join('');
                const canvas = document.createElement('canvas');
                canvas.width = 100;
                canvas.height = 100;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ff5722'; // Background color
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = '50px Arial';
                ctx.fillStyle = '#ffffff'; // Text color
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(initials, canvas.width / 2, canvas.height / 2);

                // Convert canvas to image URL
                const profilePictureURL = canvas.toDataURL();

                const userData = {
                    email: email,
                    username: userName,
                    profilePicture: profilePictureURL, // Save profile picture
                };

                error_messages.innerText = '';
                showSuccessMessage('Account created successfully', 'success-messages');
                const docRef = doc(db, "users", user.uid);
                await setDoc(docRef, userData);
                window.location.href = "/index.html";
            }
        } catch (error) {
            console.error("Error during signup:", error);
            if (error.code == 'auth/email-already-in-use') {
                error_messages.innerText = 'Email address already exists';
            } else {
                error_messages.innerText = 'Unable to create user';
            }
        }
    } else if (errors.length == 0) {
        const email = email_input.value;
        const password = password_input.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            showSuccessMessage('Login is successful', 'success-messages');
            window.location.href = "/index.html";
        } catch (error) {
            if (error.code == 'auth/user-not-found') {
                error_messages.innerText = 'Account does not exist';
            } else if (error.code == 'auth/wrong-password') {
                error_messages.innerText = 'Incorrect password';
            } else {
                error_messages.innerText = 'An error occurred. Please try again.';
                console.log(error.code);
                console.log(error.message);
            }
        }
    }
});

// Helper Functions
function showSuccessMessage(message, pId) {
    const messageP = document.getElementById(pId);
    messageP.innerText = message;
    messageP.style.opacity = 1;
    setTimeout(() => {
        messageP.style.opacity = 0;
    }, 5000);
}

function getSignupFormErrors(username, email, password, confirm_password) {
    let errors = [];

    if (username === '' || username == null) {
        errors.push('Username is required');
        username_input.parentElement.classList.add('incorrect');
    }
    if (email === '' || email == null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    }
    if (password === '' || password == null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }
    if (password.length < 8) {
        errors.push('Password must have at least 8 characters');
        password_input.parentElement.classList.add('incorrect');
    }
    if (password != confirm_password) {
        errors.push('Password does not match confirm password');
        password_input.parentElement.classList.add('incorrect');
        confirm_password_input.parentElement.classList.add('incorrect');
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = [];

    if (email === '' || email == null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect');
    }
    if (password === '' || password == null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect');
    }

    return errors;
}

const allInputs = [username_input, email_input, password_input, confirm_password_input].filter(input => input != null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
        }
    });
});
