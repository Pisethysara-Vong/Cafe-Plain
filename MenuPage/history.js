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
    const main = document.getElementById('main')

    if (receiptsHistory.length == 0) {
        const emptyHistory = `
            <h2>
                Receipts
                <button onclick="clearReceipts()">Delete history</button>
            </h2>
            <hr color="black" id="line-break">
            <p id="empty-receipts">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm-40 0v-80 80Z"/></svg>
                <span>There is no receipt</span>
            </p>
        `
        main.innerHTML = emptyHistory;
    }

    else {
        receiptsHistory.forEach((history) => {
            let historyDetailsHTML = '';
            let total = 0;
    
            history.forEach(item => {
                let { name, price, quantity, size, ice, sugar } = item;
                total += price * quantity;
    
                historyDetailsHTML += `
                    <li>
                        <div class="item-name">${name} - $${price.toFixed(2)} x${quantity}</div>
                        <div class="item-details">Size: ${size} - Ice: ${ice}% - Sugar: ${sugar}%</div>
                    </li>
                `;
            });
    
            let historyHTML = `
                <div class="history">
                    <div class="date">Date: </div>
                    <div class="receipt">
                        <div class="order-details">
                            <ul>
                                ${orderDetailsHTML}
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

function clearReceipts() {
    receiptsHistory = []; // Clear the cart array
    localStorage.setItem('receiptsHistory', JSON.stringify(receiptsHistory)); // Update localStorage
    displayHistory(); // Re-render the cart
}


// Call the function to display orders
window.onload = function() {
    displayHistory();
};
