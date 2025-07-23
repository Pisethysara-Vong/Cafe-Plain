let selectedItem = {};

function clickedItem(name, price, image){
    clearLocalStorage();
    selectedItem = {name, price, image};
    localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
}

function clearLocalStorage(){
    selectedItem = {};
    localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
}

const sideBar = document.getElementById('sidebar');
const mediaQuery = window.matchMedia("(max-width: 800px)");

function toggleSubMenu(button) {
    let isUser = JSON.parse(localStorage.getItem('isUser')) || false;

    if (isUser !== true) {
        alert("Requires Account to access.");
        return;
    }

    if (!button.nextElementSibling.classList.contains('show')) {
        closeAllSubMenus();
    }
    button.nextElementSibling.classList.toggle('show');
    button.classList.toggle('rotate');

    if (sideBar.classList.contains('close')) {
        toggleSideBar();
    }
}

function toggleSideBar() {
    closeAllSubMenus();
    sideBar.classList.toggle('close');
}

function closeAllSubMenus() {
    Array.from(sideBar.getElementsByClassName('show')).forEach(dropDown => {
        dropDown.classList.remove('show');
        dropDown.previousElementSibling.classList.remove('rotate');
    });
}

function handleScreenChange(e) {
    if (e.matches && sideBar.classList.contains('close')) {
        toggleSideBar();
    }
}

// Trigger sidebar toggle on page load if max-width is 800px or lower
if (mediaQuery.matches) {
    toggleSideBar();
}

mediaQuery.addEventListener("change", handleScreenChange);

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


window.onload = function() {
    addDropdownToggleListener();
};