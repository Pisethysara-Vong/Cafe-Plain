// Retrieve cart data from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render the cart
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');

    cartItems.innerHTML = '';  // Clear previous items
    let total = 0;

    if (cart.length === 0) {
        const emptyCart = document.createElement('p')
        emptyCart.innerHTML = `🛒 Your cart is empty`
        cartItems.appendChild(emptyCart);
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const li = document.createElement('li');
            li.innerHTML = `
                <span id="name-price">${item.name} - $${item.price.toFixed(2)}</span>
                <div class="quantity-control">
                    <button onclick="updateQuantity(${index}, -1)">–</button>
                    <span id="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div id="customization">Size: ${item.size} - Ice: ${item.ice}% - Sugar: ${item.sugar}%</div>`;
            cartItems.appendChild(li);
        });
    }

    totalAmount.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to update quantity
function updateQuantity(index, change) {
    if (cart[index].quantity + change == 0) {
        removeItem(index);
    }
    else {
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

// Function to handle checkout (you can redirect to another page or do further processing)
function checkout() {
    alert("Your order has been placed.");
    clearCart();
    // Additional checkout logic can be added here
}

// Ensure cart is persisted across pages using localStorage
window.onload = function() {
    // Retrieve cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCart();
};
