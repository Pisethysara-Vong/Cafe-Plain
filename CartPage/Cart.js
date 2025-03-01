
// Retrieve cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render the cart
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');

    cartItems.innerHTML = '';  // Clear previous items
    let total = 0;

    if (cart.length === 0) {
        const emptyCart = document.createElement('p');
        emptyCart.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
            </svg>
            <span>No items</span>
        `;
        cartItems.appendChild(emptyCart);
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const li = document.createElement('li');
            li.innerHTML = `
                <div id="name-price">
                    ${item.name} - $${item.price.toFixed(2)}
                    <div id="customization">Size: ${item.size} - Ice: ${item.ice}% - Sugar: ${item.sugar}%</div>
                </div>
                <div class="quantity-control">
                    <button onclick="updateQuantity(${index}, -1)">–</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>`;
            cartItems.appendChild(li);
        });
    }

    totalAmount.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to update quantity
function updateQuantity(index, change) {
    if (cart[index].quantity + change === 0) {
        removeItem(index);
    } else {
        cart[index].quantity += change;
        localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
        renderCart(); // Re-render the cart
    }
}

// Function to remove an item from the cart
function removeItem(index) {
    cart.splice(index, 1); // Remove item at given index
    localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
    renderCart(); // Re-render the cart
}

// Function to clear the cart
function clearCart() {
    cart = []; // Clear the cart array
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    renderCart(); // Re-render the cart
}

// Function to handle checkout
function checkout() {
    receipts.push(cart);
    localStorage.setItem('receipts', JSON.stringify(receipts));

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB');    
    cart.push({formattedDate});
    localStorage.setItem('cart', JSON.stringify(cart));
    
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    receiptsHistory.push(cart);
    localStorage.setItem('receiptsHistory', JSON.stringify(receiptsHistory));

    alert("Your order has been placed.");
    clearCart();
}

// Ensure cart is persisted across pages using localStorage
window.onload = function() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    receipts = JSON.parse(localStorage.getItem('receipts')) || [];
    receiptsHistory = JSON.parse(localStorage.getItem('receiptsHistory')) || [];

    renderCart();
};
