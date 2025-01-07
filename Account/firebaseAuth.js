// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

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


        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                username: userName,
            };
            error_messages.innerText = '';
            showSuccessMessage('Account created successfully', 'success-messages');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
            .then(() => {
                window.location.href = "/Brocode/CafeShop/HomePage/home.html";
            })
            .catch((error) => {
                console.error("error writing document", error);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode == 'auth/email-already-in-use'){
                error_messages.innerText = 'Email address already exist';
            }
            else {
                error_messages.innerText = 'Unable to create user';
            }
        })
    }
    else if (errors.length == 0){
        e.preventDefault();
        const email = email_input.value;
        const password = password_input.value;


        signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showSuccessMessage('Login is successful', 'success-messages');
            window.location.href = "/Brocode/CafeShop/HomePage/home.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/user-not-found') {
                error_messages.innerText = 'Account does not exist';
            } else if (errorCode === 'auth/wrong-password') {
                error_messages.innerText = 'Incorrect Email or Password';
            } else {
                error_messages.innerText = 'Account does not exist';
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

