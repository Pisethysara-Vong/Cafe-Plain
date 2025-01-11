import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"


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
const auth = getAuth(app);
const db = getFirestore(app);

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

        console.log(formattedMenu);
        return formattedMenu;
    } catch (error) {
        console.error("Error fetching menu items: ", error);
    }
};

const renderPage = async () => {
    try {
        const menuItems = await getMenuItems(); // Await the resolved data
        const coffee = document.getElementById('wrapper1');
        const tea = document.getElementById('wrapper2');

        menuItems.coffees.forEach((item) => {
            const template = `
            <div class="container">
                <div class="image">
                    <img src=${item.image} alt="Iced Latte">
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
                    <a href="OrderingTemplate.html">
                        <button onclick="clickedItem('${item.name}', '${item.price}', '${item.image}')" class="order-btn">+</button>
                    </a>
                </div>
            </div>`;
            coffee.insertAdjacentHTML('beforeend', template);
        });

        menuItems.teas.forEach((item) => {
            const template = `
            <div class="container">
                <div class="image">
                    <img src=${item.image} alt="Iced Latte">
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
                    <a href="OrderingTemplate.html">
                        <button onclick="clickedItem('${item.name}', '${item.price}', '${item.image}')" class="order-btn">+</button>
                    </a>
                </div>
            </div>`;
            tea.insertAdjacentHTML('beforeend', template);
        });
    } catch (error) {
        console.error("Error rendering page: ", error);
    }
};

function checkUserSession() {
    const account = document.getElementById('account');
    const sign_in = document.getElementById('sign-in');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            sign_in.style.display = "none";
        } else {
            account.style.display = "none";
        }
    });
}

document.addEventListener('DOMContentLoaded', checkUserSession);
document.addEventListener('DOMContentLoaded', renderPage);

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth)
                .then(() => {
                    window.location.href = "/Brocode/CafeShop/HomePage/home.html";
                })
                .catch((error) => {
                    console.error("Error signing out:", error.message);
                });
        });
    }
});

