const sideBar = document.getElementById('sidebar');
const mediaQuery = window.matchMedia("(max-width: 800px)");

function toggleSubMenu(button){
    if (!button.nextElementSibling.classList.contains('show')){
        closeAllSubMenus();
    }
    button.nextElementSibling.classList.toggle('show');
    button.classList.toggle('rotate');

    if (sideBar.classList.contains('close')){
        toggleSideBar();
    }
}

function toggleSideBar(){
    closeAllSubMenus();
    sideBar.classList.toggle('close');
}

function closeAllSubMenus(){
    Array.from(sideBar.getElementsByClassName('show')).forEach(dropDown => {
        dropDown.classList.remove('show');
        dropDown.previousElementSibling.classList.remove('rotate');
    })
}

function handleScreenChange(e) {
    if (e.matches && sideBar.classList.contains('close')) {
        toggleSideBar();
    }
}

mediaQuery.addEventListener("change", handleScreenChange);


let receiptsHistory = JSON.parse(localStorage.getItem('receiptsHistory')) || [];


function displayHistory() {
    const main = document.getElementById('main');

    if (receiptsHistory.length == 0) {
        const emptyHistory = `
            <h2>
                History
                <button onclick="clearReceipts()">Delete history</button>
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

            let date = history[history.length - 1].date;

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
}

function clearHistory() {
    receiptsHistory = []; // Clear the cart array
    localStorage.setItem('receiptsHistory', JSON.stringify(receiptsHistory)); // Update localStorage
    displayHistory(); // Re-render the cart
}


// Call the function to display orders
window.onload = function() {
    displayHistory();
};
