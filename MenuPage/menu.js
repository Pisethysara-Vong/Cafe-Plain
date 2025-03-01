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
const profile = document.getElementById('profile-img');
const mediaQuery = window.matchMedia("(max-width: 800px)");
const mediaQuery2 = window.matchMedia("(max-width: 1500px)");


function toggleSubMenu(button){
    let isUser = JSON.parse(localStorage.getItem('isUser')) || false;

    if (isUser !== true) {
        alert("Requires Account to access.")
        return;
    }
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

    if (mediaQuery2) {
        if (!sideBar.classList.contains('close')) {
            const wrappers = document.getElementsByClassName('wrapper');
            
            // Loop through all elements with the "wrapper" class
            for (let wrapper of wrappers) {
                wrapper.style.columnGap = '78px'; // Correct property is columnGap
            }
        }
        if (sideBar.classList.contains('close')) {
            const wrappers = document.getElementsByClassName('wrapper');
            
            // Loop through all elements with the "wrapper" class
            for (let wrapper of wrappers) {
                wrapper.style.columnGap = '44px'; // Correct property is columnGap
            }
        }
    }
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