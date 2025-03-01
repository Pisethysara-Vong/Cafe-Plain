const sideBar = document.getElementById('sidebar');
const profile = document.getElementById('profile-img');
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