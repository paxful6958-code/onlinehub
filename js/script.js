let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

let shoppingCart = document.querySelector('.shopping-cart');

document.querySelector('#cart-btn').onclick = () => {
    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
}


let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
}


window.onscroll = () => {
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

//LOGIN VALIDATION SCRIPT

/*const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (document.getElementById('user').value && document.getElementById('pass').value) {
        alert("You have successfully logged in.");
        location.reload();
    } else {
        loginErrorMsg.style.opacity = 1;
    }
})*/

//PRODUCT SLIDER SCRIPT
var swiper = new Swiper(".product-slider", {
    loop: true,
    spaceBetween: 20,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1020: {
            slidesPerView: 3,
        },
    },
});

//REVIEW SLIDER SCRIPT
var swiper = new Swiper(".review-slider", {
    loop: true,
    spaceBetween: 20,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1020: {
            slidesPerView: 3,
        },
    },
});


// Map color names to hex values
const COLOR_HEX = {
    'Black': '#1c1c1c',
    'White': '#ffffff',
    'Titanium Gray': '#8a8d8f',
    'Deep Blue': '#1a3a6b',
    'Sky Blue': '#87ceeb',
    'Purple': '#7d3c98',
    'Dark Purple': '#4a235a',
    'Green': '#3d8b40',
    'Olive Green': '#6b8e23',
    'Rose Gold': '#b76e79',
    'Gold': '#d4af37',
    'Silver': '#c0c0c0',
    'Copper': '#b87333'
};

// Convert every .color-select into dot buttons
document.querySelectorAll('select.color-select').forEach(select => {
    const wrapper = document.createElement('div');
    wrapper.className = 'color-options';
    wrapper.dataset.name = select.name || 'color';

    select.querySelectorAll('option').forEach((opt, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'color-dot' + (i === 0 ? ' selected' : '');
        dot.title = opt.value;
        dot.style.background = COLOR_HEX[opt.value] || '#ccc';
        dot.dataset.value = opt.value;

        dot.addEventListener('click', () => {
            wrapper.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected'));
            dot.classList.add('selected');
        });

        wrapper.appendChild(dot);
    });

    select.replaceWith(wrapper);
});

// Helper to read the chosen color when "add to cart" is clicked
function getSelectedColor(productBox) {
    const dot = productBox.querySelector('.color-dot.selected');
    return dot ? dot.dataset.value : null;
}


document.querySelectorAll('#add-cart, .add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const box = btn.closest('.box');
        const color = getSelectedColor(box);
        const product = box.querySelector('h3').textContent.trim();
        console.log(`Added: ${product} — Color: ${color}`);
        // ...your existing cart logic, pass `color` along
    });
});