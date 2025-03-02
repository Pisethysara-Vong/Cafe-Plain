import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

async function initializeFirebase() {
    try {
        const response = await fetch('/api/firebase-config');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const firebaseConfig = await response.json();
        console.log("✅ Firebase Config:", firebaseConfig);
        return firebaseConfig;
    } catch (err) {
        console.error("🔥 Fetch Error:", err);
    }
}

async function initializeAppAndAuth() {
    const firebaseConfig = await initializeFirebase();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    checkUserSession(auth, db);
}

initializeAppAndAuth();

function checkUserSession(auth, db) {
    const account = document.getElementById('account');
    const sign_in = document.getElementById('sign-in');
    const add_new_item = document.getElementById('add-item');
    const profileImg = document.getElementById('profile-sidebar');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            sign_in.style.display = "none";

            const loggedInUserId = user.uid;
            const docRef = doc(db, "users", loggedInUserId);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        const username = userData.username;
                        const profilePic = userData.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541';
                        
                        profileImg.src = profilePic;
                        localStorage.setItem('profile', JSON.stringify({
                            profilePic, 
                            username, 
                            email: userData.email
                        }));
                        localStorage.setItem('isUser', JSON.stringify(true));
                    } else {
                        console.log("No document found");
                    }
                })
                .catch((error) => {
                    console.error("Error getting document:", error);
                });
        } else {
            account.style.display = "none";
            add_new_item.style.display = "none";
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
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
});

const clearMenuOnClose = () => {
    localStorage.setItem('menu', JSON.stringify([]));
};

window.addEventListener('pagehide', (event) => {
    if (!event.persisted) {
        clearMenuOnClose();
    }
});
