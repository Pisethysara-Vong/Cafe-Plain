import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import {initializeFirebase} from "/firebaseConfig.js";


// Declare Firebase app and Firestore database references
let app, db;

// Initialize Firebase with config from external file
async function initialize() {
    const firebaseConfig = await initializeFirebase();
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
}

// Fetch menu items from Firestore
const getMenuItems = async () => {
    try {
        const menuCollection = collection(db, "menu");
        const querySnapshot = await getDocs(menuCollection);

        const menu = {};
        querySnapshot.forEach((doc) => {
            const { category, items } = doc.data();
            menu[category] = items;
        });

        // Return a structured object for easy rendering
        const formattedMenu = {
            coffees: menu.coffees || [],
            teas: menu.teas || []
        };

        return formattedMenu;
    } catch (error) {
        console.error("Error fetching menu items: ", error);
    }
};

// Render menu items on the page
const renderPage = async () => {
    let menu = JSON.parse(localStorage.getItem('menu')) || [];
    let menuItems;

    // Fetch from Firestore if not found in localStorage
    if (menu.length === 0) {
        menuItems = await getMenuItems();
        localStorage.setItem('menu', JSON.stringify(menuItems));
    } else {
        menuItems = menu;
        console.log("used local storage menu");
    }

    try {
        const coffee = document.getElementById('wrapper1');
        const tea = document.getElementById('wrapper2');

        // Render coffee items
        menuItems.coffees.forEach((item) => {
            const template = `
            <a href="orderingTemplate.html" onclick="clickedItem('${item.name}', '${item.price}', '${item.image}'); event.stopPropagation();">
                <div class="container">
                    <div class="image">
                        <img src=${item.image} alt="${item.name}">
                    </div>
                    <div class="text">
                        <div class="name-price">
                            <div class="item-name">${item.name}</div>
                            <div class="item-price">${item.price}</div>
                        </div>
                        <button onclick="clickedItem('${item.name}', '${item.price}', '${item.image}')" class="order-btn">+</button>
                    </div>
                </div>
            </a>`;
            coffee.insertAdjacentHTML('beforeend', template);
        });

        // Render tea items
        menuItems.teas.forEach((item) => {
            const template = `
            <a href="orderingTemplate.html" onclick="clickedItem('${item.name}', '${item.price}', '${item.image}'); event.stopPropagation();">
                <div class="container">
                    <div class="image">
                        <img src=${item.image} alt="${item.name}">
                    </div>
                    <div class="text">
                        <div class="name-price">
                            <div class="item-name">${item.name}</div>
                            <div class="item-price">${item.price}</div>
                        </div>
                        <button onclick="clickedItem('${item.name}', '${item.price}', '${item.image}')" class="order-btn">+</button>
                    </div>
                </div>
            </a>`;
            tea.insertAdjacentHTML('beforeend', template);
        });

    } catch (error) {
        console.error("Error rendering page: ", error);
    }
};

// Wait for DOM to load before starting
document.addEventListener('DOMContentLoaded', async () => {
    let menu = JSON.parse(localStorage.getItem('menu')) || [];

    if (menu.length === 0) {
        await initialize(); // Make sure Firebase is initialized
        renderPage();
    } else {
        renderPage();
    }
});
