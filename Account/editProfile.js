// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, updatePassword, updateProfile, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, doc, updateDoc, getDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import {firebaseConfig} from "../firebaseConfig.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get DOM elements
const error_messages = document.getElementById('error-messages');
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const confirm_password_input = document.getElementById("confirm-password-input");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");
const changeProfilePictureBtn = document.querySelector(".wrapper button");
const togglePasswordButton = document.getElementById('toggle-password');
const toggleConfirmPasswordButton = document.getElementById('toggle-confirm-password');
const eyeIconPassword = document.getElementById('eye-icon');
const eyeIconConfirm = document.getElementById('eye-icon-confirm');

let selectedFile = null; // Variable to store the selected file

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

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        selectedFile = file; // Store the selected file
        document.getElementById('selected-file-path').innerText = `image: ${file.name}`; // Display the file name
    });

    fileInput.click(); // Trigger the file input dialog
}

// Pre-fill form with current user data
onAuthStateChanged(auth, (user) => {
    if (user) {
        const loggedInUserId = user.uid;
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    usernameInput.value = userData.username || ""; // Pre-fill username
                    emailInput.value = userData.email || ""; // Pre-fill email
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

// Event listener for changing profile picture
changeProfilePictureBtn.addEventListener("click", changeProfilePicture);

// Event listener for cancel button
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/Brocode/CafeShop/Account/profile.html"; // Navigate back to the profile view page
});

// Event listener for confirm button
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
        confirm_password_input.parentElement.classList.add('incorrect')
    }

    if (errors.length > 0) {
        error_messages.innerText = errors.join('\n')
    }
    else {
        try {
            // Update username
            if (newUsername && newUsername !== user.displayName) {
                await updateProfile(user, { displayName: newUsername });
                const docRef = doc(db, "users", user.uid);
                await updateDoc(docRef, { username: newUsername });
            }
    
            // Update password
            if (newPassword) {
                await updatePassword(user, newPassword);
            }

            // Update profile picture if a new file is selected
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = async function () {
                    const profilePictureURL = reader.result;

                    // Update profile picture in Firebase Authentication
                    await updateProfile(user, { photoURL: profilePictureURL });

                    // Update profile picture in Firestore
                    const docRef = doc(db, "users", user.uid);
                    await updateDoc(docRef, { profilePicture: profilePictureURL });

                    alert("Profile picture updated successfully!");
                };
                reader.readAsDataURL(selectedFile);
            }
    
            alert("Profile updated successfully!");
            window.location.href = "/Brocode/CafeShop/Account/profile.html"; // Navigate back to profile page
            localStorage.setItem('profile', JSON.stringify({}));
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    }
});

const allInputs = [usernameInput, emailInput, password_input, confirm_password_input].filter(input => input != null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
        }
        error_messages.innerText = '';
    })
})

function updateToggleButtonVisibility(button, input) {
    button.style.visibility = input.value ? 'visible' : 'hidden';
};

updateToggleButtonVisibility(togglePasswordButton, password_input);
updateToggleButtonVisibility(toggleConfirmPasswordButton, confirm_password_input)


password_input.addEventListener('input', () => {
    updateToggleButtonVisibility(togglePasswordButton, password_input);
});
confirm_password_input.addEventListener('input', () => {
    updateToggleButtonVisibility(toggleConfirmPasswordButton, confirm_password_input);
});

function toggleVisibility(input, icon) {
    const isVisible = input.type === 'text';
    input.type = isVisible ? 'password' : 'text';
    icon.innerHTML = isVisible 
    ? '<path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>'
    : '<path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>';
}

togglePasswordButton.addEventListener('click', () => toggleVisibility(password_input, eyeIconPassword));
toggleConfirmPasswordButton.addEventListener('click', () => toggleVisibility(confirm_password_input, eyeIconConfirm));