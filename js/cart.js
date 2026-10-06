//Add to Cart Function
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');

    if (productNumbers) {
        document.querySelector('#cart-btn span').textContent = productNumbers;
    }
}


//Calling OnLoadCartNumbers
onLoadCartNumbers();

//Older Add to cart option

let carts = document.querySelectorAll('#add-cart');
//Event Listener to click on add to cart
for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
    })
}

//Add to cart Number Showing on Icon
function cartNumbers(product) {

    let productNumbers = localStorage.getItem('cartNumbers');


    productNumbers = parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('#cart-btn span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('#cart-btn span').textContent = 1;
    }
    setItem(product);

}


const cart = {}; // name -> {name, price, image, qty}
const cartBtnCount = document.querySelector('#cart-btn span');

document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const box = btn.closest('.swiper-slide');
        const name = box.dataset.name;
        const price = Number(box.dataset.price);
        const image = box.dataset.image;

        if (cart[name]) {
            cart[name].qty++;
        } else {
            cart[name] = { name, price, image, qty: 1 };
        }
        renderCart();
    });
});

function renderCart() {
    const container = document.querySelector('.shopping-cart');
    container.querySelectorAll('.box, .total').forEach(el => el.remove());

    let total = 0,
        count = 0;
    for (const item of Object.values(cart)) {
        total += item.price * item.qty;
        count += item.qty;

        const box = document.createElement('div');
        box.className = 'box';
        box.innerHTML = `
            <i class="fas fa-trash" data-name="${item.name}"></i>
            <img src="${item.image}" alt="${item.name}">
            <div class="content">
                <h3>${item.name}</h3>
                <span class="price">&#8377 ${item.price.toLocaleString('en-IN')}/-</span>
                <span class="quantity">qty : ${item.qty}</span>
            </div>`;
        container.prepend(box);
    }

    const totalDiv = document.createElement('div');
    totalDiv.className = 'total';
    totalDiv.textContent = ` total : \u20B9 ${total.toLocaleString('en-IN')}/- `;
    container.querySelector('.btn').before(totalDiv);

    cartBtnCount.textContent = count;
}

// delete items
document.querySelector('.shopping-cart').addEventListener('click', e => {
    if (e.target.classList.contains('fa-trash')) {
        delete cart[e.target.dataset.name];
        renderCart();
    }
});