// ==========================================================
//  MOBI_HUB — main script (fully rewritten, && null-safety)
//  - Null-safe header toggles via && guards
//  - Product + review sliders (guarded)
//  - Responsive color picker (dropdown on desktop, boxes on mobile)
//  - Dot color buttons for bare selects (product slider cards)
//  - Cart logic in USD (localStorage), index-safe delete
//  - Everything runs after DOM is ready
// ==========================================================

document.addEventListener('DOMContentLoaded', function() {

    // ---------- 1. HEADER TOGGLES (null-safe with &&) ----------
    var searchForm = document.querySelector('.search-form');
    var shoppingCart = document.querySelector('.shopping-cart');
    var loginForm = document.querySelector('.login-form');
    var navbar = document.querySelector('.navbar');

    var searchBtn = document.querySelector('#search-btn');
    var cartBtn = document.querySelector('#cart-btn');
    var loginBtn = document.querySelector('#login-btn');
    var menuBtn = document.querySelector('#menu-btn');

    // Close every panel, then open the requested one
    var openOnly = function(el) {
        [searchForm, shoppingCart, loginForm, navbar].forEach(function(other) {
            other && other.classList.remove('active');
        });
        el && el.classList.add('active');
    };

    searchBtn && searchBtn.addEventListener('click', function() {
        openOnly(searchForm);
    });

    cartBtn && cartBtn.addEventListener('click', function() {
        openOnly(shoppingCart);
    });

    loginBtn && loginBtn.addEventListener('click', function() {
        openOnly(loginForm);
    });

    menuBtn && menuBtn.addEventListener('click', function() {
        openOnly(navbar);
    });

    window.addEventListener('scroll', function() {
        searchForm && searchForm.classList.remove('active');
        shoppingCart && shoppingCart.classList.remove('active');
        loginForm && loginForm.classList.remove('active');
        navbar && navbar.classList.remove('active');
    }, { passive: true });

    // ---------- 2. SLIDERS ----------
    if (typeof Swiper !== 'undefined') {
        var sliderOpts = {
            loop: true,
            spaceBetween: 20,
            autoplay: { delay: 3000, disableOnInteraction: false },
            centeredSlides: true,
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1020: { slidesPerView: 3 }
            }
        };

        document.querySelector('.product-slider') &&
            new Swiper('.product-slider', sliderOpts);

        document.querySelector('.review-slider') &&
            new Swiper('.review-slider', sliderOpts);
    }

    // ---------- 3. COLOR PICKER ----------

    // Color name → hex for swatches
    var COLOR_HEX = {
        'Black': '#1c1c1c',
        'White': '#ffffff',
        'Titanium Gray': '#8a8d8f',
        'Deep Blue': '#1a3a6b',
        'Sky Blue': '#87ceeb',
        'Blue': '#1e6fd9',
        'Purple': '#7d3c98',
        'Dark Purple': '#4a235a',
        'Green': '#3d8b40',
        'Olive Green': '#6b8e23',
        'Rose Gold': '#b76e79',
        'Gold': '#d4af37',
        'Silver': '#c0c0c0',
        'Copper': '#b87333'
    };

    // CASE A: selects inside .color-picker (iphone.html etc.)
    // Dropdown stays on desktop; tappable boxes built and kept in sync
    document.querySelectorAll('.color-picker').forEach(function(picker) {
        var select = picker.querySelector('.color-select');
        var boxWrap = picker.querySelector('.color-boxes');
        if (!select || !boxWrap) return;

        var syncSelection = function() {
            boxWrap.querySelectorAll('.color-box').forEach(function(b) {
                b.classList.toggle('selected', b.dataset.value === select.value);
            });
        };

        Array.from(select.options).forEach(function(opt) {
            var box = document.createElement('button');
            box.type = 'button';
            box.className = 'color-box';
            box.dataset.value = opt.value;

            var swatch = document.createElement('span');
            swatch.className = 'swatch' +
                (/white|silver/i.test(opt.value) ? ' light' : '');
            swatch.style.background = COLOR_HEX[opt.value] || '#999';

            var label = document.createElement('span');
            label.textContent = opt.value;

            box.appendChild(swatch);
            box.appendChild(label);

            box.addEventListener('click', function() {
                select.value = opt.value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                syncSelection();
            });

            boxWrap.appendChild(box);
        });

        select.addEventListener('change', syncSelection);
        syncSelection();
    });

    // CASE B: bare selects NOT inside .color-picker (index.html slider)
    // Convert to dot buttons
    document.querySelectorAll('select.color-select').forEach(function(select) {
        if (select.closest('.color-picker')) return;

        var wrapper = document.createElement('div');
        wrapper.className = 'color-options';

        select.querySelectorAll('option').forEach(function(opt, i) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'color-dot' + (i === 0 ? ' selected' : '');
            dot.title = opt.value;
            dot.style.background = COLOR_HEX[opt.value] || '#ccc';
            dot.dataset.value = opt.value;

            dot.addEventListener('click', function() {
                wrapper.querySelectorAll('.color-dot').forEach(function(d) {
                    d.classList.remove('selected');
                });
                dot.classList.add('selected');
            });

            wrapper.appendChild(dot);
        });

        select.replaceWith(wrapper);
    });

    // Read chosen color from either UI variant
    var getSelectedColor = function(productBox) {
        var dot = productBox.querySelector('.color-dot.selected');
        if (dot) return dot.dataset.value;
        var select = productBox.querySelector('.color-select');
        return select ? select.value : null;
    };

    // ---------- 4. CART (USD) ----------
    var cart;
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        cart = [];
    }
    if (!Array.isArray(cart)) cart = [];

    var updateCount = function() {
        document.querySelectorAll('#cart-btn span, #cart-count').forEach(function(el) {
            el.textContent = cart.reduce(function(s, item) {
                return s + (Number(item.qty) || 0);
            }, 0);
        });
    };

    // Match cart panel whether it's an id or a class
    var getCartBox = function() {
        return document.getElementById('shopping-cart') ||
            document.querySelector('.shopping-cart');
    };

    var renderCart = function() {
        var cartBox = getCartBox();

        if (!cartBox) {
            updateCount();
            return;
        }

        // Remove old item boxes (keep total + checkout link)
        cartBox.querySelectorAll('.box').forEach(function(b) { b.remove(); });

        var total = 0;
        cart.forEach(function(item) {
            total += (Number(item.price) || 0) * (Number(item.qty) || 0);

            var box = document.createElement('div');
            box.className = 'box';
            box.dataset.name = item.name; // stable keys, not volatile index
            box.dataset.color = item.color;

            var trash = document.createElement('i');
            trash.className = 'fas fa-trash';
            trash.style.cursor = 'pointer';

            var img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;

            var content = document.createElement('div');
            content.className = 'content';

            var title = document.createElement('h3');
            title.textContent = item.name;

            var price = document.createElement('span');
            price.className = 'price';
            price.textContent = '$' + Number(item.price).toLocaleString('en-US') + '/-';

            var qty = document.createElement('span');
            qty.className = 'quantity';
            qty.textContent = 'qty : ' + item.qty;

            var color = document.createElement('span');
            color.className = 'quantity';
            color.textContent = 'color : ' + item.color;

            content.appendChild(title);
            content.appendChild(price);
            content.appendChild(qty);
            content.appendChild(color);

            box.appendChild(trash);
            box.appendChild(img);
            box.appendChild(content);

            cartBox.prepend(box);
        });

        var totalEl = cartBox.querySelector('.total');
        if (totalEl) {
            totalEl.textContent = ' total : $' + total.toLocaleString('en-US') + '/-';
        }

        updateCount();
    };

    var saveCart = function() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    // Delete items — delegated, keyed on name+color (index-safe)
    document.addEventListener('click', function(e) {
        var trash = e.target.closest('.fa-trash');
        if (!trash) return;

        var box = trash.closest('.box');
        if (!box || !box.dataset.name) return;

        var idx = cart.findIndex(function(i) {
            return i.name === box.dataset.name && i.color === box.dataset.color;
        });
        if (idx !== -1) {
            cart.splice(idx, 1);
            saveCart();
        }
    });

    // "Add to cart" — class-based (no duplicate-ID problem)
    document.querySelectorAll('.add-cart').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            var card = btn.closest('.box') ||
                btn.closest('.swiper-slide') ||
                btn.closest('.card');
            if (!card) return;

            var nameEl = card.querySelector('h3');
            var imgEl = card.querySelector('img');
            var priceEl = card.querySelector('.price');
            if (!nameEl || !imgEl || !priceEl) return;

            var name = nameEl.textContent.trim();
            var image = imgEl.src;
            var price = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) || 0;
            var color = getSelectedColor(card) || 'Default';

            var existing = cart.find(function(i) {
                return i.name === name && i.color === color;
            });
            if (existing) {
                existing.qty = (Number(existing.qty) || 0) + 1;
            } else {
                cart.push({ name: name, price: price, image: image, color: color, qty: 1 });
            }

            saveCart();
        });
    });

    // Initial render (cart is defined before this runs)
    renderCart();
});