
let receipts = JSON.parse(localStorage.getItem('receipts')) || [];

// Display the receipts on the page
function displayReceipts() {
    const main = document.getElementById('main')

    // If no history, show "No receipts" message with dropdown menu
    if (receipts.length == 0) {
        const emptyReceipts = `
            <h2>
                Receipts
                <div class="more">
                    <div class="more-dropdown">
                        <div onclick="toggle()" class="more-dropdown-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
                        </div>
                    <ul class="more-dropdown-list">
                        <li class="more-dropdown-list-item">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                            <button onclick="clearReceipts()" class="delete-btn">Delete receipts</button>
                        </li>
                    </ul>
                    </div>
                </div>
            </h2>
            <hr color="black" id="line-break">
            <p id="empty-receipts">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z"/></svg>
                <span>No receipts</span>
            </p>
        `
        main.innerHTML = emptyReceipts;
    }

    else {
        // Loop through each receipt and display its details
        receipts.forEach((receipt, index) => {
            let orderNumber = index + 1;
            let receiptDetailsHTML = '';
            let total = 0;
            
            // Build list items for each drink in the order
            receipt.forEach(item => {
                let { name, price, quantity, size, ice, sugar } = item;
                total += price * quantity;
    
                receiptDetailsHTML += `
                    <li>
                        <div class="item-name">${name} - $${price.toFixed(2)} x${quantity}</div>
                        <div class="item-details">Size: ${size} - Ice: ${ice}% - Sugar: ${sugar}%</div>
                    </li>
                `;
            });
    
            // Create and insert the full receipt block into the page
            let receiptHTML = `
                <div class="receipt">
                    <div class="order-number">
                        <strong>#${orderNumber}</strong>
                    </div>
                    <div class="order-details">
                        <ul>
                            ${receiptDetailsHTML}
                        </ul>
                    </div>
                    <div class="total">
                        <strong>Total: $${total.toFixed(2)}</strong>
                    </div>
                </div>
            `;
            main.insertAdjacentHTML('beforeend', receiptHTML);
        });
    }
    // Enable dropdown functionality for "more" menu
    addDropdownToggleListener();
}

// Clear receipts from memory and UI
function clearReceipts() {
    receipts = []; // Clear the cart array
    localStorage.setItem('receipts', JSON.stringify(receipts)); // Update localStorage
    displayReceipts(); // Re-render the cart
}

// Add toggle behavior for dropdown menu
function addDropdownToggleListener() {
    let btn = document.querySelector(".more-dropdown-btn");
    let moreDropdownList = document.querySelector(".more-dropdown-list");

    if (btn && moreDropdownList) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent event bubbling
            moreDropdownList.classList.toggle("active");
            btn.classList.toggle("active");
        });
    }

    // Close dropdown if user clicks anywhere else
    window.addEventListener("click", () => {
        moreDropdownList?.classList.remove("active");
        btn?.classList.remove("active");
    });
}


// Load receipts when the page is ready
window.onload = function() {
    displayReceipts();
};
