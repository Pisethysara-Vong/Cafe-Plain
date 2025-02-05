import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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

// Set the min date dynamically
const dateInput = document.getElementById('date-input');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Handle room availability check
document.getElementById("reservation-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const date = document.getElementById("date-input").value;
    const timeSlot = document.getElementById("time-input").value;
    const roomsList = document.getElementById("room-list");

    if (!date || !timeSlot) {
        alert("Please select both date and time slot.");
        return;
    }

    roomsList.innerHTML = "<p>Checking availability...</p>";

    try {
        const roomsRef = collection(db, "reservations");
        const snapshot = await getDocs(roomsRef);

        roomsList.innerHTML = ""; // Clear previous results

        const availableRooms = snapshot.docs.filter(doc => {
            const bookings = doc.data().bookings;
            return !bookings.some(booking => booking.date === date && booking.time === timeSlot);
        });

        if (availableRooms.length === 0) {
            roomsList.innerHTML = "<p>No available rooms for this time slot.</p>";
            return;
        }

        availableRooms.forEach(doc => {
            const roomData = doc.data();
            const roomDiv = document.createElement("div");
            roomDiv.classList.add("room");

            roomDiv.innerHTML = `
                <div id="room-num">
                    ${roomData.room}
                </div>
                <button onclick="bookRoom('${doc.id}', '${roomData.room}', '${date}', '${timeSlot}')">Book</button>
            `;

            roomsList.appendChild(roomDiv);
        });
    } catch (error) {
        console.error("Error fetching rooms: ", error);
        roomsList.innerHTML = "<p>Error checking rooms. Please try again later.</p>";
    }
});

window.bookRoom = async function (roomId, roomName, date, timeSlot) {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to book a room.");
        return;
    }

    const userId = user.uid;

    try {
        // Update room's booking
        const roomRef = doc(db, "reservations", roomId);
        await updateDoc(roomRef, {
            bookings: arrayUnion({ date, time: timeSlot })
        });

        // Store reservation under user's account
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            reservations: arrayUnion({
                date: date,
                time: timeSlot,
                room: roomName
            })
        });

        alert("Room booked successfully!");
        document.getElementById("reservation-form").reset();
        document.getElementById("room-list").innerHTML = ""; // Clear room list after booking
    } catch (error) {
        console.error("Error booking room: ", error);
        alert("Failed to book room. Try again.");
    }
}

