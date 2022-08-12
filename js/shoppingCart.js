import items from './items.js';

// cart item object example
// {
//     id: 3, - id of item from 'items'
//     qty: 20 - quantity of added items
// }
let itemsInCart = [];

// item getters
function getItemDataById(id) {
    return items.find(item => id == item.id);
}

function getItemInCart(id) {
    return itemsInCart.find(item => id == item.id)
}

// adding items to cart
export function addItemToCart(id) {
    const itemInCart = getItemInCart(id);

    if (!itemInCart) {
        itemsInCart.push({
            id: id,
            qty: 1
        })
    } else {
        increaseItemQty(id);
    }

    renderCart();
}

// deleting items from cart
function removeItemFromCart(id) {
    const pos = itemsInCart.findIndex((item) => {
        return item.id == id;
    });

    if (pos != -1) {
        itemsInCart.splice(pos, 1);
        renderCart();
    }
}

// increase item quantity
function increaseItemQty(id) {
    const itemInCart = getItemInCart(id);

    if (itemInCart) {
        itemInCart.qty = itemInCart.qty + 1
    }
    renderCart();
}

// decrease item quantity
function decreaseItemQty(id) {
    const itemInCart = getItemInCart(id);

    if (itemInCart && itemInCart.qty > 2) {
        itemInCart.qty = itemInCart.qty - 1
    } else if (itemInCart && itemInCart.qty == 1) {
        removeItemFromCart(id);
    }
    renderCart();
}

// rendering cart items
function renderCart() {
    renderCartItems();
    renderCartTotals();
}

function renderCartItems() {
    let renderedItems = '';
    let cartItemsElement = document.querySelector('.shopping-cart-items');

    itemsInCart.forEach((cartItem) => {
        const item = getItemDataById(cartItem.id);
        renderedItems += renderCartItem(item, cartItem.qty);
    });

    cartItemsElement.innerHTML = renderedItems;
}

function renderCartItem(item, qty) {
    return `
    <div class="item">
        <div class="item-info-container">
            <img class="item-img" src="img/${item.imgUrl}" alt="">
            <div class="item-info">
                <h6>${item.name}</h6>
                <span>${getItemTotalPrice(item.id, qty)} $</span>
            </div>
        </div>
        <div class="quantity-counter">
            <div class="counter-block">
                <img onclick="decreaseItemQty(${item.id})" src="img/icons/cart-shopping-icon1.svg" alt="">
                <span>${qty}</span>
                <img onclick="increaseItemQty(${item.id})" src="img/icons/shopping-cart-icon2.svg" alt="">
            </div>
            <div class="remove-block">
                <img onclick="removeItemFromCart(${item.id})" src="img/icons/shopping-cart-icon-remove.svg" alt="">
            </div>
        </div>
    </div>`;
}

function getCalculatedCartTotals() {
    let totalPrice = 0;
    let totalQty = 0;

    itemsInCart.forEach((item) => {
        // calculate total qty
        totalQty = item.qty + totalQty;

        // calculate total price
        totalPrice = getItemTotalPrice(item.id, item.qty) + totalPrice;
    });

    return {
        totalPrice: totalPrice,
        totalQty: totalQty
    }
}

function getItemTotalPrice(id, qty) {
    const itemData = getItemDataById(id);
    const total = itemData.price * qty;

    return total;
}

function renderCartTotals() {
    const totalsData = getCalculatedCartTotals();
    const totalsElement = document.getElementById('cart-totals');

    totalsElement.innerHTML = `
            <div class="amount total">
                <span>Total amount:<span class="strong">${totalsData.totalQty} ptc.</span></span>
            </div>
            <div class="price total">
                <span>Total price:<span class="strong">${totalsData.totalPrice} $</span></span>
            </div> `
}

// working with persistent storage (localStorage)
// function getItemsFromStorage()
// function setItemsFromStorage(cartItems)

function initDomEvents() {
    let shoppingCart = document.querySelector(".shopping-cart");
    let openShoppingCartBtn = document.querySelector('.header-shopping-cart-icon');

    openShoppingCartBtn.addEventListener('click', (event) => {
        shoppingCart.classList.toggle('active');
    });

    // document.addEventListener('click', (event) => {
    //     const target = event.target;
    //     const closestToCart = target.closest('.shopping-cart');
    //     const closestToCartButton = target.closest('.header-shopping-cart-icon');

    //     console.log(closestToCart);
    //     console.log(closestToCartButton);

    //     if(!closestToCart && !closestToCartButton) {
    //         shoppingCart.classList.remove('active');
    //     }    
    // })
}

export default function initShoppingCart() {
    window.increaseItemQty = increaseItemQty;
    window.decreaseItemQty = decreaseItemQty;
    window.removeItemFromCart = removeItemFromCart;
    initDomEvents();

    // get cart state from local storage if exist

    renderCart();
}