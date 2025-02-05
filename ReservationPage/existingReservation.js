import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;  // Save the user to a variable
        renderPage();         // Now call renderPage when the user is authenticated
    } else {
        console.log("User is not authenticated");
    }
});

const getReservations = async () => {
    if (!currentUser) {
        console.error("No user is logged in.");
        return []; // If no user is logged in, return an empty array
    }

    const userId = currentUser.uid;
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.log("No such user found!");
            return [];
        }

        const userData = userSnap.data();
        return userData.reservations || []; // Return reservations or empty array if none
    } catch (error) {
        console.error("Error fetching reservations: ", error);
        return [];
    }
};

const renderPage = async () => {
    const reservations_list = document.getElementById('res-receipts');

    try {
        const reservations = await getReservations();
        reservations_list.innerHTML = '';
        reservations.forEach((item) => {
            const template = `
            <div class="receipt">
                <ul>
                    <li>
                        <div>
                            Date: ${item.date}
                        </div>
                        <div>
                            Time: ${item.time}
                        </div>
                        <div>
                            Room: ${item.room}
                        </div>
                    </li>
                </ul>
                <button title="Remove">x</button>
            </div>`;
            reservations_list.insertAdjacentHTML('beforeend', template);
        });
    } catch (error) {
        console.error("Error rendering page: ", error);
    }
};

window.onload = function () {
    document.getElementById('res-receipts').innerHTML = "<p>Loading...";
}

