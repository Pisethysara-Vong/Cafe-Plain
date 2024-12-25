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

function renderAccount(){
    const ul = document.getElementById('ul');
    
    const accTemplate = `
        <hr>
            <li>
                <a href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                    <span>Profile</span>
                </a>
            </li>  
    `
    ul.insertAdjacentHTML('beforeend', accTemplate);
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


const form = document.getElementById('form');
const username_input = document.getElementById('username-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const confirm_password_input = document.getElementById('confirm-password-input');
const error_messages = document.getElementById('error-messages')

form.addEventListener('submit', (e) => {
    // e.preventDefault();

    let errors = [];

    if (username_input) {
        errors = getSignupFormErrors(username_input.value, email_input.value, password_input.value, confirm_password_input.value);
    }
    else {
        errors = getLoginFormErrors(email_input.value, password_input.value);
        
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_messages.innerText = errors.join('\n')
    }
})

function getSignupFormErrors(username, email, password, confirm_password) {
    let errors = [];

    if (username === '' || username == null) {
        errors.push('Username is required');
        username_input.parentElement.classList.add('incorrect')
    }
    if (email === '' || email == null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect')
    }
    if (password === '' || password == null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect')
    }
    if (password.length < 8) {
        errors.push('Password must have at least 8 characters');
        password_input.parentElement.classList.add('incorrect')
    }
    if (password != confirm_password) {
        errors.push('Password does not match confirm password');
        password_input.parentElement.classList.add('incorrect');
        confirm_password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = [];

    if (email === '' || email == null) {
        errors.push('Email is required');
        email_input.parentElement.classList.add('incorrect')
    }
    if (password === '' || password == null) {
        errors.push('Password is required');
        password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

const allInputs = [username_input, email_input, password_input, confirm_password_input].filter(input => input != null);

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')) {
            input.parentElement.classList.remove('incorrect');
        }
    })
})
