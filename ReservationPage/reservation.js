import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { initializeFirebase } from "/firebaseConfig.js";

// Initialize Firebase
let app, db, auth;

async function initialize() {
    try {
        const firebaseConfig = await initializeFirebase(); // Get the Firebase config
        app = initializeApp(firebaseConfig); // Initialize Firebase app
        db = getFirestore(app); // Initialize Firestore database
        auth = getAuth(app); // Initialize Firebase Auth
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        throw new Error("Failed to initialize Firebase. Please try again later.");
    }
}

// Set the min date dynamically
const dateInput = document.getElementById('date-input');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Handle room availability check
document.getElementById("reservation-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Ensure Firebase is initialized
    if (!app || !db || !auth) {
        try {
            await initialize();
        } catch (error) {
            console.error("Firebase initialization error:", error);
            alert("Failed to initialize Firebase. Please try again later.");
            return;
        }
    }

    const date = document.getElementById("date-input").value;
    const timeSlot = document.getElementById("time-input").value;
    const roomsList = document.getElementById("room-list");
    let errors = [];
    document.getElementById('error-messages').innerText = '';

    if (!date) {
        errors.push('Please select a date');
        document.getElementById("date-input").parentElement.classList.add('incorrect');
    }
    if (!timeSlot) {
        errors.push('Please select a time slot');
        document.getElementById("time-input").parentElement.classList.add('incorrect');
    }

    if (errors.length > 0) {
        document.getElementById('error-messages').innerText = errors.join('\n');
        return;
    }

    // Get current date and time
    const now = new Date();
    const selectedDate = new Date(date);

    // Extract time slot range
    const [startTimeStr, endTimeStr] = timeSlot.split("-");
    const [startHour, startMinute] = startTimeStr.split(":").map(Number);

    // Create a Date object for the selected time slot
    const selectedTime = new Date(selectedDate);
    selectedTime.setHours(startHour, startMinute, 0, 0);

    // Check if selected time is in the past
    if (selectedTime < now) {
        roomsList.innerHTML = "<p>No available rooms for this timeslot.</p>";
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

// Function to book a room
window.bookRoom = async function (roomId, roomName, date, timeSlot) {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to book a room.");
        return;
    }

    const userId = user.uid;

    try {
        const schedule = {
            "08:00-10:00": "08:00 AM - 10:00 AM",
            "10:00-12:00": "10:00 AM - 12:00 PM",
            "12:00-14:00": "12:00 PM - 02:00 PM",
            "14:00-16:00": "02:00 PM - 04:00 PM",
            "16:00-18:00": "04:00 PM - 06:00 PM",
            "18:00-20:00": "06:00 PM - 08:00 PM",
        };

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
                time: schedule[timeSlot],
                room: roomName,
                roomId: roomId
            })
        });

        alert("Room booked successfully!");
        document.getElementById("reservation-form").reset();
        document.getElementById("room-list").innerHTML = ""; // Clear room list after booking
    } catch (error) {
        console.error("Error booking room: ", error);
        alert("Failed to book room. Try again.");
    }
};

// Clear error messages when user starts typing
const allInputs = [document.getElementById("date-input"), document.getElementById("time-input")].filter(input => input != null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
        }
        document.getElementById('error-messages').innerText = '';
    });
});