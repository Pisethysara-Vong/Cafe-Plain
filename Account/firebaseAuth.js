// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, setDoc, doc, query, where, getDocs, collection} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import {firebaseConfig} from "firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("Firebase persistence set to local"))
    .catch((error) => console.error("Failed to set persistence:", error));

const form = document.getElementById('form');
const username_input = document.getElementById('username-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const confirm_password_input = document.getElementById('confirm-password-input');
const error_messages = document.getElementById('error-messages')
const togglePasswordButton = document.getElementById('toggle-password');
const toggleConfirmPasswordButton = document.getElementById('toggle-confirm-password');
const eyeIconPassword = document.getElementById('eye-icon');
const eyeIconConfirm = document.getElementById('eye-icon-confirm');

form.addEventListener('submit', (e) => {
    // e.preventDefault();

    let errors = [];

    if (username_input) {
        errors = getSignupFormErrors(username_input.value, email_input.value, password_input.value, confirm_password_input.value);
    }
    else {
        errors = getLoginFormErrors(email_input.value, password_input.value);
        
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_messages.innerText = errors.join('\n')
    }
    else if (errors.length == 0 && username_input) {
        e.preventDefault();
        const userName = username_input.value;
        const email = email_input.value;
        const password = password_input.value;
    
        // Check if username already exists
        const usersRef = collection(db, "users") // Reference to the "users" collection
        const usernameQuery = query(usersRef, where("username", "==", userName)); // Create a query to check username
    
        getDocs(usernameQuery).then((querySnapshot) => {
            if (!querySnapshot.empty) {
                // Username already exists
                error_messages.innerText = 'Username already exists';
                username_input.parentElement.classList.add('incorrect');
            }
            else {
                // Proceed with account creation
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
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
                        setDoc(docRef, userData)
                            .then(() => {
                                window.location.href = "HomePage/index.html";
                            })
                            .catch((error) => {
                                console.error("Error writing document", error);
                            });
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        if (errorCode == 'auth/email-already-in-use') {
                            error_messages.innerText = 'Email address already exists';
                        } else {
                            error_messages.innerText = 'Unable to create user';
                        }
                    });
            }
        }).catch((error) => {
            console.error("Error checking username:", error);
            error_messages.innerText = 'Error checking username availability';
        });
    }
    else if (errors.length == 0){
        e.preventDefault();
        const email = email_input.value;
        const password = password_input.value;


        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showSuccessMessage('Login is successful', 'success-messages');
            window.location.href = "HomePage/index.html";
        })
        .catch((error) => {
            if (error.code == 'auth/user-not-found') {
                error_messages.innerText = 'Account does not exist';
            } else if (error.code == 'auth/wrong-password') {
                error_messages.innerText = 'Incorrect password';
            } else {
                error_messages.innerText = 'An error occurred. Please try again.';
                console.log(error.code);
                console.log(error.message);
            }
        })
    }
})

function showSuccessMessage(message, pId) {
    var messageP = document.getElementById(pId);
    messageP.innerText = message;
    messageP.style.opacity = 1;
    setTimeout(function(){
        messageP.style.opacity = 0;
    }, 5000);
}

function getSignupFormErrors(username, email, password, confirm_password) {
    let errors = [];
    
    if (username === '' || username == null) {
        errors.push('Username is required');
        username_input.parentElement.classList.add('incorrect')
    }
    if (email === '' || email == null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect')
    }
    if (password === '' || password == null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect')
    }
    if (password.length < 8) {
        errors.push('Password must have at least 8 characters');
        password_input.parentElement.classList.add('incorrect')
    }
    if (password != confirm_password) {
        errors.push('Password does not match confirm password');
        password_input.parentElement.classList.add('incorrect');
        confirm_password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = [];

    if (email === '' || email == null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect')
    }
    if (password === '' || password == null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

const allInputs = [username_input, email_input, password_input, confirm_password_input].filter(input => input != null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
        }
    })
})

function initPasswordToggles(input, button, icon) {
    const updateVisibility = () => {
        button.style.visibility = input.value ? 'visible' : 'hidden';
    };
    const togglePassword = () => {
        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';
        icon.innerHTML = isVisible
        ? '<path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>'
        : '<path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>';
    };

    input.addEventListener('input', updateVisibility);
    button.addEventListener('click', togglePassword);
    updateVisibility();
}

window.onload = function() {
    if (username_input) {
        initPasswordToggles(password_input, togglePasswordButton, eyeIconPassword);
        initPasswordToggles(confirm_password_input, toggleConfirmPasswordButton, eyeIconConfirm);
    }
    else {
        initPasswordToggles(password_input, togglePasswordButton, eyeIconPassword);
    }
}