

let basePrice; // Declare basePrice globally so we can access it in multiple functions
let quantity = 1;
let selectedItem = JSON.parse(localStorage.getItem('selectedItem')) || {};
let cart = [];


// Function to render the page based on parameters
function renderPage() {

    const { name, price, image } = selectedItem;
    basePrice = parseFloat(price);

    document.getElementById('Img').innerHTML = `<img src="${image}" alt="${name}">`;
    document.getElementById('Txt').innerHTML = `<p>${name}</p>`;
    document.getElementById('price').textContent = `Price: $${basePrice.toFixed(2)}`;
    document.getElementById('quantity').textContent = quantity;
}

function getAdjustment(selector, adjustments) {
    const selectedOption = document.querySelector(`${selector}:checked`);
    return selectedOption ? adjustments[selectedOption.id] : 0;
}

// Function to update the total price
function updateTotal() {
    const sizeAdjustments = {
        "option1_size": 0.00,
        "option2_size": 0.50, // Medium
        "option3_size": 1.00  // Large
    };

    const updatedPrice = basePrice + getAdjustment('.size-answer', sizeAdjustments);
    const total = updatedPrice * quantity;
    document.getElementById('price').textContent = `Price: $${total.toFixed(2)}`;
}

// Function to handle quantity change
function handleQuantityChange(change) {
    const quantityElement = document.getElementById('quantity');
    quantity += change; // Update quantity by change (+1 or -1)
    
    // Prevent negative or zero quantity
    if (quantity < 1) {
        quantity = 1;
    }

    quantityElement.textContent = quantity; // Update the quantity display
    updateTotal(); // Recalculate total
}

// Function to add item to cart
// Function to add item to cart and store it in localStorage
function addToCart() {
    const sizeAdjustments = {
        "option1_size": 0.00,
        "option2_size": 0.50, // Medium
        "option3_size": 1.00  // Large
    };
    const name = selectedItem.name;
    let price = basePrice + getAdjustment('.size-answer', sizeAdjustments);
    let ice = 0;
    let sugar = 0;
    let size = '';


    const sizeOptions = {
        "option1_size": 'Small',
        "option2_size": 'Medium',
        "option3_size": 'Large',

    }

    size = getAdjustment('.size-answer', sizeOptions)

    const iceOptions = {
        "option1_ice": 25,
        "option2_ice": 50,
        "option3_ice": 75,
        "option4_ice": 100

    }

    ice = getAdjustment('.ice-answer', iceOptions)

    const sugarOptions = {
        "option1_sugar": 25,
        "option2_sugar": 50,
        "option3_sugar": 75,
        "option4_sugar": 100

    }

    sugar = getAdjustment('.sugar-answer', sugarOptions)
    document.getElementById('error-message1').innerText = "";
    document.getElementById('error-message2').innerText = "";
    document.getElementById('error-message3').innerText = "";

    if (size == '') {
        document.getElementById('error-message1').innerText = "Please select a size";
    }
    if (ice == 0) {
        document.getElementById('error-message2').innerText = "Please select an ice option";
    }
    if (sugar == 0) {
        document.getElementById('error-message3').innerText = "Please select a sugar option";
    }
    else {
        cart.push({ name, price, quantity, size, ice, sugar });
        localStorage.setItem('cart', JSON.stringify(cart));

        alert("Item added to cart!");
        history.back();

    }
}


// Call the renderPage function when the page loads
window.onload = function() {
    renderPage();
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add event listeners to radio buttons to update price when size changes
    document.querySelectorAll('.size-answer').forEach(optionEl => {
        optionEl.addEventListener('change', updateTotal); // Call updateTotal() when size changes
    });

    document.getElementById('increase').addEventListener('click', function() {
        handleQuantityChange(1); // Increase quantity
    });

    document.getElementById('decrease').addEventListener('click', function() {
        handleQuantityChange(-1); // Decrease quantity
    });
};