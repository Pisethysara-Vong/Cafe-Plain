import {collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
import {initializeAppAndAuth} from "/firebaseConfig.js";


// Initialize Firebase
async function initialize() {
    await initializeAppAndAuth(); // Wait for Firebase to be initialized before proceeding
    renderPage(); // Call renderPage only after initialization is complete
}

initialize();

const addMenuItems = async () => {
    try {
        const menuCollection = collection(db, "menu");

        // Add coffees
        await addDoc(menuCollection, { category: "coffees", items: coffees });

        // Add teas
        await addDoc(menuCollection, { category: "teas", items: teas });

        console.log("Menu items added successfully!");
    } catch (error) {
        console.error("Error adding menu items: ", error);
    }
};

const getMenuItems = async () => {
    try {
        const menuCollection = collection(db, "menu");
        const querySnapshot = await getDocs(menuCollection);

        const menu = {};
        querySnapshot.forEach((doc) => {
            const { category, items } = doc.data();
            menu[category] = items;
        });

        // Combine coffees and teas into one object
        const formattedMenu = {
            coffees: menu.coffees || [],
            teas: menu.teas || []
        };

        return formattedMenu;
    } catch (error) {
        console.error("Error fetching menu items: ", error);
    }
};

const renderPage = async () => {
    
    let menu = JSON.parse(localStorage.getItem('menu')) || [];
    let menuItems;

    if (menu.length == 0) {
        menuItems = await getMenuItems();
        localStorage.setItem('menu', JSON.stringify(menuItems));
    } else {
        menuItems = menu;
        console.log("used local storage menu")
    }


    try {
        const coffee = document.getElementById('wrapper1');
        const tea = document.getElementById('wrapper2');

        menuItems.coffees.forEach((item) => {
            const template = `
            <a href="orderingTemplate.html" onclick="clickedItem('${item.name}', '${item.price}', '${item.image}'); event.stopPropagation();">
                <div class="container">
                    <div class="image">
                        <img src=${item.image} alt="${item.name}">
                    </div>
                    <div class="text">
                        <div class="name-price">
                            <div class="item-name">
                                ${item.name}
                            </div>
                            <div class="item-price">
                                ${item.price}
                            </div>
                        </div>
                        <!-- Pass ID and Name as URL parameters -->
                        <button onclick="clickedItem('${item.name}', '${item.price}', '${item.image}')" class="order-btn">+</button>
                    </div>
                </div>
            </a>`;
            coffee.insertAdjacentHTML('beforeend', template);
        });

        menuItems.teas.forEach((item) => {
            const template = `
            <a href="orderingTemplate.html" onclick="clickedItem('${item.name}', '${item.price}', '${item.image}'); event.stopPropagation();">
                <div class="container">
                    <div class="image">
                        <img src=${item.image} alt="${item.name}">
                    </div>
                    <div class="text">
                        <div class="name-price">
                            <div class="item-name">
                                ${item.name}
                            </div>
                            <div class="item-price">
                                ${item.price}
                            </div>
                        </div>
                        <!-- Pass ID and Name as URL parameters -->
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

document.addEventListener('DOMContentLoaded', () => {
    initialize(); // Ensure everything initializes first before rendering
});
