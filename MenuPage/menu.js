
let selectedItem = {};

const menuItems = [
    {
        name: "Iced Latte",
        price: "1.50$",
        image: "https://images.ctfassets.net/v601h1fyjgba/71VWCR6Oclk14tsdM9gTyM/6921cc6b21746f62846c99fa6a872c35/Iced_Latte.jpg"
    },
    {
        name: "Iced Americano",
        price: "1.50$",
        image: "https://www.yesmooretea.com/wp-content/uploads/2021/11/Iced-Americano-2.jpg"
    },
    {
        name: "Iced Cappuccino",
        price: "1.50$",
        image: "https://142079338.cdn6.editmysite.com/uploads/1/4/2/0/142079338/s589659027750538725_p149_i1_w598.jpeg"
    },
    {
        name: "Iced Espresso",
        price: "1.50$",
        image: "https://images.aws.nestle.recipes/resized/08ee4b739607eed390994f64190cd0a4_iced_shaken_espresso_nescafe_1080_850.jpg"
    },
    {
        name: "Iced Chocolate",
        price: "1.50$",
        image: "https://i0.wp.com/www.sipandsanity.com/wp-content/uploads/2023/04/FI-iced-chocolate-almond-milk-shaken-espresso.jpg?ssl=1"
    },
    {
        name: "Iced Green Tea",
        price: "1.50$",
        image: "https://gimmedelicious.com/wp-content/uploads/2018/03/Iced-Matcha-Latte2.jpg"
    },
    {
        name: "Iced Macchiatto",
        price: "1.50$",
        image: "https://www.allrecipes.com/thmb/LgtetzzQWH3GMxFISSii84XEAB8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/258686-IcedCaramelMacchiato-ddmps-4x3-104704-2effb74f7d504b8aa5fbd52204d0e2e5.jpg"
    },
    {
        name: "Iced Mocha",
        price: "1.50$",
        image: "https://feynman.coffee/cdn/shop/products/IcedMocha-01_2048x.jpg?v=1617701624"
    }
]

function renderPage(){
    const items = document.getElementById('wrapper');

    menuItems.forEach((item) => {
        const template = `
        <div class="container">
            <div class="image">
                <img src=${item.image} alt="Iced Latte">
            </div>
            <div class="text">
                ${item.name}
                <!-- Pass ID and Name as URL parameters -->
                <a href="OrderingTemplate.html">
                    <button onclick="clickedItem('${item.name}', '${item.price}', '${item.image}')">+</button>
                </a>
                <br>
                ${item.price}
            </div>
        </div>`
        items.insertAdjacentHTML('beforeend', template);

    });
}

function clickedItem(name, price, image){
    clearLocalStorage();
    selectedItem = {name, price, image};
    localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
}

function clearLocalStorage(){
    selectedItem = {};
    localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
}

let profileDropdownList = document.querySelector(".profile-dropdown-list");
let btn = document.querySelector(".profile-dropdown-btn");

let classList = profileDropdownList.classList;

const toggle = () => classList.toggle("active");

window.addEventListener("click", function (e) {
    if (!btn.contains(e.target)) classList.remove("active");
});



window.onload = function() {
    renderPage();
};