// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, updatePassword, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeFirebase } from "/firebaseConfig.js";

// Firebase references
let app, auth, db;

// Initialize Firebase services
async function initializeAppAndAuth() {
    const firebaseConfig = await initializeFirebase(); // Get config
    app = initializeApp(firebaseConfig);               // Init Firebase app
    auth = getAuth(app);                               // Init Auth
    db = getFirestore(app);                            // Init Firestore
}

// DOM element references
const error_messages = document.getElementById('error-messages');
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const confirm_password_input = document.getElementById("confirm-password-input");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");
const changeProfilePictureBtn = document.getElementById("change-profile-btn");

// Globals
let base64Image = "";
let currentUser = null;

// Load current user's data and populate inputs
async function setupProfile() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                const docRef = doc(db, "users", user.uid);
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

// Initialize Firebase and load profile data
async function initializeAppAndRender() {
    try {
        await initializeAppAndAuth();
        await setupProfile();
    } catch (error) {
        console.error("Initialization error:", error);
        alert("Failed to initialize the app. Please try again.");
    }
}

// Run setup when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await initializeAppAndRender();
});

// Handle profile picture change
async function changeProfilePicture() {
    const user = auth.currentUser;
    if (!user) {
        alert("No user is signed in.");
        return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        document.getElementById('selected-file-path').innerText = `Image: ${file.name}`;
        try {
            base64Image = await resizeAndConvertToBase64(file);
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to process image. Try another one.");
        }
    });

    fileInput.click(); // Open file dialog
}

// Resize image and convert to Base64
async function resizeAndConvertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxWidth = 300;
                let scale = maxWidth / img.width;
                if (scale > 1) scale = 1;

                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                resolve(canvas.toDataURL("image/png", 0.7));
            };

            img.onerror = () => reject(new Error("Image failed to load"));
        };

        reader.onerror = () => reject(new Error("File reading failed"));
    });
}

// Event listener for profile picture change
changeProfilePictureBtn.addEventListener("click", changeProfilePicture);

// Handle cancel button
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/Account/profile.html";
});

// Handle confirm/save changes
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

    // Validate input
    if (!newUsername) {
        errors.push('Username cannot be empty');
        usernameInput.parentElement.classList.add('incorrect');
    }
    if (newPassword && newPassword !== confirmNewPassword) {
        errors.push('Password does not match confirm password');
        password_input.parentElement.classList.add('incorrect');
        confirm_password_input.parentElement.classList.add('incorrect');
    }

    // Show validation errors if any
    if (errors.length > 0) {
        error_messages.innerText = errors.join('\n');
    } else {
        try {
            // Update display name in Auth and Firestore
            if (newUsername && newUsername !== user.displayName) {
                await updateProfile(currentUser, { displayName: newUsername });
                const docRef = doc(db, "users", currentUser.uid);
                await updateDoc(docRef, { username: newUsername });
            }

            // Update password
            if (newPassword) {
                await updatePassword(currentUser, newPassword);
            }

            // Save profile picture to Firestore
            if (base64Image) {
                const docRef = doc(db, "users", currentUser.uid);
                await updateDoc(docRef, { profilePicture: base64Image });
                console.log("Profile picture updated in Firestore:", base64Image);
            }

            alert("Profile updated successfully!");
            window.location.href = "/Account/profile.html";
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    }
});
