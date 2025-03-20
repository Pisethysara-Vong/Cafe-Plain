const sideBar = document.getElementById('sidebar');
const username_input = document.getElementById('username-input');
const mediaQuery = window.matchMedia("(max-width: 800px)");
const password_input = document.getElementById('password-input');
const confirm_password_input = document.getElementById('confirm-password-input');
const togglePasswordButton = document.getElementById('toggle-password');
const toggleConfirmPasswordButton = document.getElementById('toggle-confirm-password');
const eyeIconPassword = document.getElementById('eye-icon');
const eyeIconConfirm = document.getElementById('eye-icon-confirm');
const changeProfilePictureBtn = document.getElementById("change-profile-btn");



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

function initPasswordToggles(input, button, icon) {
    
    const togglePassword = () => {
        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';
        icon.innerHTML = isVisible
            ? '<path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>'
            : '<path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>';
    };

    button.addEventListener('click', togglePassword);
}

window.onload = function () {
    if (username_input) {
        initPasswordToggles(password_input, togglePasswordButton, eyeIconPassword);
        initPasswordToggles(confirm_password_input, toggleConfirmPasswordButton, eyeIconConfirm);
    } else {
        initPasswordToggles(password_input, togglePasswordButton, eyeIconPassword);
    }
};