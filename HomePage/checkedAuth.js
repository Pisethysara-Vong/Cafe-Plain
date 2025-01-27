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


function checkUserSession() {
    const account = document.getElementById('account');
    const sign_in = document.getElementById('sign-in');
    const profileImg = document.getElementById('profile-sidebar');

    let isUser = JSON.parse(localStorage.getItem('isUser')) || '';
    let profile = JSON.parse(localStorage.getItem('profile')) || {};

    if (isUser === true) {
        sign_in.style.display = "none";
        profileImg.src = profile.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'; // Fallback to a default image if none is found
    }
    else if (isUser === false) {
        account.style.display = "none";
    }
    else {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                sign_in.style.display = "none";

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
                            const profileImg = document.getElementById('profile-sidebar');

                            profileImg.src = profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'; // Fallback to a default image if none is found
                            localStorage.setItem('profile', JSON.stringify({profilePic, username, email, creationTime}));
                            localStorage.setItem('isUser', JSON.stringify(true));

                        } else {
                            console.log("No document found");
                        }
                    })
                    .catch((error) => {
                        console.error("Error getting document:", error);
                    });
            } 
            else {
                account.style.display = "none";
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', checkUserSession);

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth)
                .then(() => {
                    window.location.href = "/Brocode/CafeShop/HomePage/home.html";
                    localStorage.setItem('profile', JSON.stringify({}));
                    localStorage.setItem('isUser', JSON.stringify(''));
                })
                .catch((error) => {
                    console.error("Error signing out:", error.message);
                });
        });
    }
});




