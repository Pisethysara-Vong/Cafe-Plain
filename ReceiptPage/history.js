// Retrieve receipts history from localStorage or initialize with empty array
let receiptsHistory = JSON.parse(localStorage.getItem('receiptsHistory')) || [];

// Display the receipts history on the page
function displayHistory() {
    const main = document.getElementById('main');

    // If no history, show "No history" message with dropdown menu
    if (receiptsHistory.length == 0) {
        const emptyHistory = `
            <h2>
            History
            <div class="more">
                <div class="more-dropdown">
                    <div class="more-dropdown-btn">
                        <svg>...</svg>
                    </div>
                    <ul class="more-dropdown-list">
                        <li class="more-dropdown-list-item">
                            <svg>...</svg>
                            <button onclick="clearHistory()" class="delete-btn">Delete history</button>
                        </li>
                    </ul>
                </div>
            </div>
            </h2>
            <hr color="black" id="line-break">
            <p id="empty-receipts">
                <svg>...</svg>
                <span>No history</span>
            </p>
        `;
        main.innerHTML = emptyHistory;
    } else {
        // Loop through each receipt and display its details
        receiptsHistory.forEach((history) => {
            let historyDetailsHTML = '';
            let total = 0;

            // Build list items for each drink in the order
            for (let i = 0; i < history.length - 1; i++) {
                let { name, price, quantity, size, ice, sugar } = history[i];
                total += price * quantity;

                historyDetailsHTML += `
                    <li>
                        <div class="item-name">${name} - $${price.toFixed(2)} x${quantity}</div>
                        <div class="item-details">Size: ${size} - Ice: ${ice}% - Sugar: ${sugar}%</div>
                    </li>
                `;
            }

            // Get the date of the order (last element in the history array)
            let date = history[history.length - 1].formattedDate;

            // Create and insert the full receipt block into the page
            let historyHTML = `
                <div class="history">
                    <div class="date">Date: ${date}</div>
                    <div class="receipt">
                        <div class="order-details">
                            <ul>
                                ${historyDetailsHTML}
                            </ul>
                        </div>
                        <div class="total">
                            <strong>Total: $${total.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            `;
            main.insertAdjacentHTML('beforeend', historyHTML);
        });
    }

    // Enable dropdown functionality for "more" menu
    addDropdownToggleListener();
}

// Clear history from memory and UI
function clearHistory() {
    receiptsHistory = [];
    localStorage.setItem('receiptsHistory', JSON.stringify(receiptsHistory));
    displayHistory(); // Refresh UI
}

// Add toggle behavior for dropdown menu
function addDropdownToggleListener() {
    let btn = document.querySelector(".more-dropdown-btn");
    let moreDropdownList = document.querySelector(".more-dropdown-list");

    if (btn && moreDropdownList) {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
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

// Load history when the page is ready
window.onload = function () {
    displayHistory();
};
