// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, doc, getDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import {firebaseConfig} from "/firebaseConfig.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function renderProfile() {
    let profile = JSON.parse(localStorage.getItem('profile')) || {};

    if (Object.keys(profile).length === 0) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const loggedInUserId = user.uid;
                const docRef = doc(db, "users", loggedInUserId);
                getDoc(docRef)
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            const creationTime = new Date(user.metadata.creationTime).toLocaleString();
                            const username = userData.username;
                            const email = userData.email;
                            const profilePic = userData.profilePicture;
        
                            // Update profile picture, username, email, and creation time
                            const profileImg = document.querySelector('.wrapper img');
                            profileImg.src = profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'; // Fallback to a default image if none is found
                            profileImg.alt = `${username}'s profile picture`;
                            document.getElementById('username').innerText = username;
                            document.getElementById('email').innerText = email;
                            document.getElementById('created').innerText = creationTime;
                            
                            localStorage.setItem('profile', JSON.stringify({profilePic, username, email, creationTime}))

                        } else {
                            console.log("No document found");
                        }
                    })
                    .catch((error) => {
                        console.error("Error getting document:", error);
                    });
            } else {
                console.log("No user found");
            }
        });
    }
    else {
        const profileImg = document.querySelector('.wrapper img');
        profileImg.src = profile.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'; // Fallback to a default image if none is found
        profileImg.alt = `${profile.username}'s profile picture`;
        document.getElementById('username').innerText = profile.username;
        document.getElementById('email').innerText = profile.email;
        document.getElementById('created').innerText = profile.creationTime;
    }
}

window.onload = function() {
    renderProfile();
}
