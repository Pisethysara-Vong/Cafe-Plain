
let receiptsHistory = JSON.parse(localStorage.getItem('receiptsHistory')) || [];

function displayHistory() {
    const main = document.getElementById('main');

    if (receiptsHistory.length == 0) {
        const emptyHistory = `
            <h2>
            History
            <div class="more">
                <div class="more-dropdown">
                    <div class="more-dropdown-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
                    </div>
                    <ul class="more-dropdown-list">
                        <li class="more-dropdown-list-item">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                            <button onclick="clearHistory()" class="delete-btn">Delete history</button>
                        </li>
                    </ul>
                </div>
            </div>
            </h2>
            <hr color="black" id="line-break">
            <p id="empty-receipts">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/></svg>
                <span>No history</span>
            </p>
        `;
        main.innerHTML = emptyHistory;
    } else {
        receiptsHistory.forEach((history) => {
            let historyDetailsHTML = '';
            let total = 0;

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

            let date = history[history.length - 1].formattedDate;

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
    addDropdownToggleListener();
}

function clearHistory() {
    receiptsHistory = [];
    localStorage.setItem('receiptsHistory', JSON.stringify(receiptsHistory));
    displayHistory();
}

// Function to add toggle functionality
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

    window.addEventListener("click", () => {
        moreDropdownList?.classList.remove("active");
        btn?.classList.remove("active");
    });
}

// Call the function to display orders
window.onload = function () {
    displayHistory();
};

