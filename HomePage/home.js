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

function renderAccount() {
    const account = document.getElementById('account');
    const sign_in = document.getElementById('sign-in');
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    if (loggedInUserId) {
        sign_in.style.display = "none";
    }
    else {
        account.style.display = "none";
    }
}

mediaQuery.addEventListener("change", handleScreenChange);


