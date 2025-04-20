import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeFirebase } from "/firebaseConfig.js";


// Firebase app, auth, and db references
let app, auth, db;

// Initialize Firebase app, auth, and Firestore
async function initializeAppAndAuth() {
    const firebaseConfig = await initializeFirebase();
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
}

// Check if the user is logged in and update UI accordingly
function checkUserSession() {
    const account = document.getElementById('account');
    const signInBtn = document.getElementById('sign-in');
    const addNewItem = document.getElementById('add-item');
    const profileImg = document.getElementById('profile-sidebar');

    let isUser = JSON.parse(localStorage.getItem('isUser')) || false;
    let profile = JSON.parse(localStorage.getItem('profile')) || {};

    if (isUser === true) {
        signInBtn.style.display = "none";
        profileImg.src = profile.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541';
    } else {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                signInBtn.style.display = "none";

                const docRef = doc(db, "users", user.uid);
                getDoc(docRef)
                    .then((docSnap) => {
                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            const profilePic = userData.profilePicture;
                            const profileData = {
                                username: userData.username,
                                email: userData.email,
                                profilePic: profilePic,
                                creationTime: new Date(user.metadata.creationTime).toLocaleString()
                            };

                            profileImg.src = profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541';

                            localStorage.setItem('profile', JSON.stringify(profileData));
                            localStorage.setItem('isUser', JSON.stringify(true));
                        } else {
                            console.log("No user document found.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching user document:", error);
                    });
            } else {
                account.style.display = "none";
                addNewItem.style.display = "none";
            }
        });
    }
}

// Handle logout
function setupLogoutButton() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const auth = getAuth();
            signOut(auth)
                .then(() => {
                    window.location.href = "index.html";
                    localStorage.setItem('profile', JSON.stringify({}));
                    localStorage.setItem('isUser', JSON.stringify(false));
                })
                .catch((error) => {
                    console.error("Error signing out:", error.message);
                });
        });
    }
}

// Clear cached menu when page is closed or navigated away
const clearMenuOnClose = () => {
    localStorage.setItem('menu', JSON.stringify([]));
};

window.addEventListener('pagehide', (event) => {
    if (!event.persisted) {
        clearMenuOnClose();
    }
});

// Initialize everything once DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const isUser = JSON.parse(localStorage.getItem('isUser')) || false;

    if (!isUser) {
        await initializeAppAndAuth();
    }

    checkUserSession();
    setupLogoutButton();
});