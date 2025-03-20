// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, updatePassword, updateProfile, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, doc, updateDoc, getDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import {initializeFirebase} from "/firebaseConfig.js";

// Initialize Firebase
let app, auth, db;

async function initializeAppAndAuth() {
    const firebaseConfig = await initializeFirebase(); // Get the Firebase config
    app = initializeApp(firebaseConfig); // Initialize Firebase app
    auth = getAuth(app); // Initialize Firebase Auth
    db = getFirestore(app); // Initialize Firestore database
}

// Get DOM elements
const error_messages = document.getElementById('error-messages');
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const confirm_password_input = document.getElementById("confirm-password-input");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");
const changeProfilePictureBtn = document.getElementById("change-profile-btn");


let base64Image = "";
let currentUser = null;

// Function to set up user profile page after Firebase setup
async function setupProfile() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                const loggedInUserId = user.uid;
                const docRef = doc(db, "users", loggedInUserId);
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        usernameInput.value = userData.username || "";
                        emailInput.value = userData.email || "";
                        resolve();
                    } else {
                        console.log("No document found");
                        resolve();
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                    reject(error);
                }
            } else {
                console.log("No user found");
                resolve();
            }
        });
    });
}

// Call Firebase initialization and setup profile once Firebase is ready
async function initializeAppAndRender() {
    try {
        await initializeAppAndAuth(); // Wait for Firebase to initialize
        await setupProfile(); // Wait for profile setup to complete
    } catch (error) {
        console.error("Initialization error:", error);
        alert("Failed to initialize the app. Please try again.");
    }
}

// Initialize app and handle profile on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    await initializeAppAndRender(); // Ensure Firebase is initialized before anything else
});

// Function to upload and change profile picture
async function changeProfilePicture() {
    const user = auth.currentUser;
    if (!user) {
        alert("No user is signed in.");
        return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Allow image files only

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        document.getElementById('selected-file-path').innerText = `Image: ${file.name}`;
        // Convert image to Base64
        try {
            base64Image = await resizeAndConvertToBase64(file);
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to process image. Try another one.");
        }
    });

    fileInput.click(); // Trigger the file input dialog
}

// Resizes and converts image to base64
async function resizeAndConvertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxWidth = 300; // Adjust max width
                let scale = maxWidth / img.width;
                if (scale > 1) scale = 1; // Prevent upscaling

                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                resolve(canvas.toDataURL("image/png", 0.7)); // Adjust quality if needed
            };

            img.onerror = () => reject(new Error("Image failed to load"));
        };

        reader.onerror = () => reject(new Error("File reading failed"));
    });
}

// Event listener for changing profile picture
changeProfilePictureBtn.addEventListener("click", changeProfilePicture);

// Event listener for cancel button
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/Account/profile.html"; // Navigate back to the profile view page
});

confirmBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        console.error("No user is signed in.");
        return;
    }

    let errors = [];
    error_messages.innerText = '';

    const newUsername = usernameInput.value;
    const newPassword = password_input.value;
    const confirmNewPassword = confirm_password_input.value;

    if (!newUsername) {
        errors.push('Username cannot be empty');
        usernameInput.parentElement.classList.add('incorrect');
    }
    if (newPassword && newPassword !== confirmNewPassword) {
        errors.push('Password does not match confirm password');
        password_input.parentElement.classList.add('incorrect');
        confirm_password_input.parentElement.classList.add('incorrect');
    }

    if (errors.length > 0) {
        error_messages.innerText = errors.join('\n');
    } else {
        try {
            // Update username
            if (newUsername && newUsername !== user.displayName) {
                await updateProfile(currentUser, { displayName: newUsername });
                const docRef = doc(db, "users", currentUser.uid);
                await updateDoc(docRef, { username: newUsername });
            }

            // Update password
            if (newPassword) {
                await updatePassword(currentUser, newPassword);
            }

            // Update profile picture if a new file is selected
            if (base64Image) {
                // Store the Base64 image in Firestore
                const docRef = doc(db, "users", currentUser.uid);
                await updateDoc(docRef, { profilePicture: base64Image });

                console.log("Profile picture updated in Firestore:", base64Image);
            }

            alert("Profile updated successfully!");
            window.location.href = "/Account/profile.html"; // Navigate back to profile page
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    }
});

