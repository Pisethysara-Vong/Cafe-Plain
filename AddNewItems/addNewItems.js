import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, getDocs, collection, updateDoc, arrayUnion, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { firebaseConfig } from "/firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const add_image_btn = document.getElementById('add-image');
const category = document.getElementById('category-input');
const itemName = document.getElementById('drink-input');
const itemPrice = document.getElementById('price-input');
const error_messages = document.getElementById('error-messages');

let selectedFile = null;
let base64Image = "";

async function addImage() {
    const user = auth.currentUser;
    if (!user) {
        alert("No user is signed in.");
        return;
    }
    if (add_image_btn.parentElement.classList.contains('incorrect')) {
        add_image_btn.parentElement.classList.remove('incorrect');
    }
    error_messages.innerText = '';

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Allow image files only

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        selectedFile = file;
        document.getElementById('selected-file-path').innerText = `Image: ${file.name}`;
        add_image_btn.style.display = 'none';
        document.getElementById('selected-file-path').style.display = 'block';

        // Convert image to Base64
        try {
            base64Image = await resizeAndConvertToBase64(file);
        } catch (error) {
            console.error("Error processing image:", error);
            alert("Failed to process image. Try another one.");
        }
    });

    fileInput.click();
}

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

add_image_btn.addEventListener("click", addImage);

document.getElementById('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        console.error("No user is signed in.");
        return;
    }

    let errors = [];
    error_messages.innerText = '';
    const categoryValue = category.value.trim();
    const drink = itemName.value.trim();
    const price = itemPrice.value.trim();

    if (!categoryValue) {
        errors.push('Please select a category');
        category.parentElement.classList.add('incorrect');
    }
    if (!drink) {
        errors.push('Please enter the name of the item');
        itemName.parentElement.classList.add('incorrect');
    }
    if (!price) {
        errors.push('Please enter the price of the item');
        itemPrice.parentElement.classList.add('incorrect');
    }
    if (!base64Image) {
        errors.push('Please select an image');
        add_image_btn.parentElement.classList.add('incorrect');
    }

    if (errors.length > 0) {
        error_messages.innerText = errors.join('\n');
        return;
    }

    try {
        const menuCollection = collection(db, "menu");
        const snapshot = await getDocs(menuCollection);

        let categoryDoc = snapshot.docs.find(doc => doc.data().category === categoryValue);
        if (!categoryDoc) {
            console.error("Category not found in Firestore.");
            alert("Category does not exist.");
            return;
        }

        const docRef = doc(db, "menu", categoryDoc.id); // Get document reference

        // Store Base64 image in Firestore
        await updateDoc(docRef, {
            items: arrayUnion({
                image: base64Image,  // Store Base64 image instead of URL
                name: drink,
                price: price
            })
        });

        alert("Item added successfully!");
        document.getElementById('form').reset();
        add_image_btn.style.display = 'block';
        document.getElementById('selected-file-path').style.display = 'none';

    } catch (error) {
        console.error("Error adding new item: ", error);
        alert("Failed to add new item. Try again.");
    }
});

const allInputs = [category, itemName, itemPrice, add_image_btn].filter(input => input != null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
        }
        error_messages.innerText = '';
    });
});
