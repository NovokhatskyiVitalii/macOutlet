import { getItemDataById } from './items.js';


let itemsInCart = [];

const MAX_ITEM_QTY = 4;
const MIN_ITEM_QTY = 1;

const LOCAL_STORAGE_KEY = "itemsInCart";

function getItemInCart(id) {
    return itemsInCart.find(item => id == item.id)
}

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

    cartItemsUpdated();
}

function removeItemFromCart(id) {
    const pos = itemsInCart.findIndex((item) => {
        return item.id == id;
    });

    if (pos != -1) {
        itemsInCart.splice(pos, 1);
        cartItemsUpdated();
    }
}

function increaseItemQty(id) {
    const itemInCart = getItemInCart(id);

    if (itemInCart && itemInCart.qty < MAX_ITEM_QTY) {
        itemInCart.qty = itemInCart.qty + 1
    }
    cartItemsUpdated();
}

function decreaseItemQty(id) {
    const itemInCart = getItemInCart(id);

    if (itemInCart && itemInCart.qty > MIN_ITEM_QTY) {
        itemInCart.qty = itemInCart.qty - 1
    }
    cartItemsUpdated();
}

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
    let increaseQtyClass = "";
    let decreaseQtyClass = "";

    if (qty == MIN_ITEM_QTY) {
        decreaseQtyClass = "disabled"
    } else if (qty == MAX_ITEM_QTY) {
        increaseQtyClass = "disabled"
    }


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
                <img onclick="decreaseItemQty(${item.id})" class="${decreaseQtyClass}" src="img/icons/cart-shopping-icon1.svg" alt="">
                <span>${qty}</span>
                <img onclick="increaseItemQty(${item.id})" class ="${increaseQtyClass}"  src="img/icons/shopping-cart-icon2.svg" alt="">
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

// function renderCountIconShopping() {
//     const totalsData = getCalculatedCartTotals();
//     const totalsElementIconShopping = document.getElementById('count-total');

//     totalsElementIconShopping.innerHTML = `
//             <span class="circle">${totalsData.totalQty}</span>`
// }

function getItemsFromStorage() {
    let cartItemsJSON = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (cartItemsJSON) {
        return JSON.parse(cartItemsJSON);
    }
    return [];
}

function setItemsToStorage(cartItems) {
    let cartItemsJSON = JSON.stringify(cartItems);

    localStorage.setItem(LOCAL_STORAGE_KEY, cartItemsJSON);
}

function cartItemsUpdated() {
    renderCart();
    setItemsToStorage(itemsInCart);
}

function initDomEvents() {
    let shoppingCart = document.querySelector(".shopping-cart");
    let openShoppingCartBtn = document.querySelector('.header-shopping-cart-icon');

    openShoppingCartBtn.addEventListener('click', (event) => {
        shoppingCart.classList.toggle('active');
    });
}

export default function initShoppingCart() {
    window.increaseItemQty = increaseItemQty;
    window.decreaseItemQty = decreaseItemQty;
    window.removeItemFromCart = removeItemFromCart;
    initDomEvents();

    itemsInCart = getItemsFromStorage();

    cartItemsUpdated();
}