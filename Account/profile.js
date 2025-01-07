// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, doc, getDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        const loggedInUserId = user.uid;
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const creationTime = new Date(user.metadata.creationTime).toLocaleString();
                document.getElementById('username').innerText = userData.username;
                document.getElementById('email').innerText = userData.email;
                document.getElementById('created').innerText = creationTime;

            }
            else {
                console.log("No document found");
            }
        })
        .catch((error) => {
            console.log("Error getting document");
        })

    }
    else {
        console.log("No user found");
    }
})