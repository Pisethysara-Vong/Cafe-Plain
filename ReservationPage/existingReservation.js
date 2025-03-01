import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {firebaseConfig} from "../firebaseConfig.js";


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
        if (reservations.length == 0) {
            document.getElementById('res-receipts').innerHTML = `
            <p>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M160-120v-240h640v240h-80v-160H240v160h-80Zm20-280q-25 0-42.5-17.5T120-460q0-25 17.5-42.5T180-520q25 0 42.5 17.5T240-460q0 25-17.5 42.5T180-400Zm100 0v-360q0-33 23.5-56.5T360-840h240q33 0 56.5 23.5T680-760v360H280Zm500 0q-25 0-42.5-17.5T720-460q0-25 17.5-42.5T780-520q25 0 42.5 17.5T840-460q0 25-17.5 42.5T780-400Zm-420-80h240v-280H360v280Zm0 0h240-240Z"/></svg>
            No reservations
            </p>`;
        }
        else {
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
                    <button title="Remove" onclick="removeRoom('${item.roomId}', '${item.room}', '${item.date}', '${item.time}')">x</button>
                </div>`;
                reservations_list.insertAdjacentHTML('beforeend', template);
            });
        }
    } catch (error) {
        console.error("Error rendering page: ", error);
    }
};

window.removeRoom = async function(roomId, roomName, date, timeSlot) {
    const userId = currentUser.uid;
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        const roomsRef = doc(db, "reservations", roomId);
        const snapshot = await getDoc(roomsRef);
        const roomData = snapshot.data();
            
        // Filter out the specific reservation
        const updatedUserReservations = userData.reservations.filter(receipt => 
            !(receipt.room === roomName && receipt.date === date && receipt.time === timeSlot)
        );

        const updatedReservations = roomData.bookings.filter(reservation => {
            !(reservation.date === date && reservation.time === timeSlot)
        })
    
        // Update the Firestore document with the new reservations array
        await updateDoc(userRef, { reservations: updatedUserReservations });
        await updateDoc(roomsRef, { bookings: updatedReservations });
    
        console.log("Reservation deleted successfully");
        renderPage();
    } catch (error) {
        console.error("Error deleting reservations: ", error);
    }
}

window.onload = function () {
    document.getElementById('res-receipts').innerHTML = "<p>Loading...</p>";
}

