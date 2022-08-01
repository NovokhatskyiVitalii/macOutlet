import items from './items.js';

let accordionButtons = document.getElementsByClassName("accordion");
let modalElement = document.getElementById('modal');
let searchInput = document.getElementById('search-input');

const MAX_PRICE = getMaxItemPrice();
const MIN_PRICE = getMinItemPrice();

let filters = {
  searchText: '',
  price: {
    from: MIN_PRICE,
    to: MAX_PRICE,
  }
};

function getReviewsAsText(reviews) {
  if (reviews >= 50) {
    return "Above average";
  } else if (reviews <= 15) {
    return "Shit";
  }

  return "Below average";
}

function renderItem(item) {
  let orderStock = item.orderInfo.inStock;
  let orderReviews = item.orderInfo.reviews;
  let textReviews = getReviewsAsText(item.orderInfo.reviews);
  let imgUrl = '';
  let btnClass = '';
  let isDisabled = orderStock == 0;

  if (isDisabled) {
    imgUrl = "img/icons/logo-check-noitems.svg"
    btnClass = "card-btn disabled"
  } else {
    imgUrl = "img/icons/check-icon.svg"
    btnClass = "card-btn"
  }

  return `
    <div class="item-card">
      <img src="img/icons/like1.svg" class="like-img" width="20px" alt="like">

      <div class="img-card">
        <img src="img/${item.imgUrl}" alt="">
      </div> 
      <div class="card-info">
        <h3>${item.name}</h3>
        <div class="check-img">
          <img src="${imgUrl}" alt="">
          <div class="text color-txt-info">
            <span class="str-text">${orderStock}</span> left in stock
          </div>
        </div>
        <span class="color-txt-info">Price: <span class="str-text">${item.price}</span> $</span>
        <button onclick="openModal(${item.id})" class="${btnClass}" ${isDisabled ? 'disabled' : ''} >Add to cart</button>
      </div>
      <div class="stats-card">
        <div class="like-stats-img">
          <img src="img/icons/likefull.svg" alt="">
        </div>
        <div class="stats-text color-txt-stats">
          <span><span class="str-text">${orderReviews}%</span> Positive reviews</span>
          <span>${textReviews}</span>
        </div>
        <div class="orders color-txt-stats">
          <span class="str-text">${item.orderInfo.orders}</span>
          <span>orders</span>
        </div>
      </div>
    </div>
  `;
}

function renderItems(itemsToRender) {
  let itemsElement = document.getElementById('catalog-items');
  let renderedItems = '';

  itemsToRender.forEach(item => {
    renderedItems += renderItem(item);
  });

  itemsElement.innerHTML = renderedItems;
}

function renderModal(item) {

  let orderStock = item.orderInfo.inStock;
  let reviews = item.orderInfo.reviews;
  let textReviews = getReviewsAsText(item.orderInfo.reviews);
  let btnClass = "";
  let isDisabled = orderStock == 0;

  if (isDisabled) {
    btnClass = "card-btn disabled"
  } else {
    btnClass = "card-btn"
  }

  return `
    <div class="modal-content">
        <div class="modal-img">
          <img src="img/${item.imgUrl}" alt="">
        </div>
      <div class="modal-info">
          <h4>${item.name}</h4>
            <div class="stats-card modal-stats-card">
            <div class="like-stats-img">
                <img src="img/icons/likefull.svg" alt="">
                </div>
            <div class="stats-text color-txt-stats">
                <span><span class="str-text">${reviews}%</span> Positive reviews</span>
                <span>${textReviews}</span>
            </div>
            <div class="orders color-txt-stats">
                <span class="str-text">${item.orderInfo.orders}</span>
                <span>orders</span>
            </div>
            </div>
            <div class="about-descr">
                <span class="about">Color:<span class="about-text">${item.color}</span></span>
                <span class="about">Operating System:<span class="about-text">${item.os}</span></span>
                <span class="about">Chip:<span class="about-text">${item.name}</span></span>
                <span class="about">Height:<span class="about-text">${item.size.height} cm</span></span>
                <span class="about">Width<span class="about-text">${item.size.width} cm</span></span>
                <span class="about">Depth<span class="about-text">${item.size.depth} cm</span></span>
                <span class="about">Weight<span class="about-text">${item.size.weight} g</span></span>
              </div>
            </div>
            <div class="modal-price">
                <span class="price">$${item.price}</span>
                <span class="modal-str-text">Stock: <span class="txt-price">${orderStock}</span> pcs.</span>
                <button class="${btnClass}" ${isDisabled ? 'disabled' : ''}>Add to cart</button>
            </div>
    </div>
  `;
}

function openModal(id) {
  let item = items.find((element) => {
    if (id == element.id) {
      return true;
    }
    return false;
  });

  modalElement.innerHTML = renderModal(item);

  modalElement.classList.remove('closed');
}

function filtersUpdated() {
  let filteredItems = JSON.parse(JSON.stringify(items));

  if (filters.searchText != '') {
    filteredItems = filteredItems.filter((item) => {
      let itemName = item.name.toLowerCase();
      let substring = filters.searchText.toLowerCase();

      return itemName.includes(substring);
    });
  }

  if (filters.price.from != '') {
    filteredItems = filteredItems.filter((item) => {
      return item.price >= filters.price.from;
    });
  }

  if (filters.price.to != '') {
    filteredItems = filteredItems.filter((item) => {
      return item.price <= filters.price.to;
    });
  }


  

  renderItems(filteredItems);
}

function applyOpenPanelEvent(buttonElement, panelElement) {
  buttonElement.addEventListener("click", function () {
    buttonElement.classList.toggle("active");
    if (panelElement.style.maxHeight) {
      panelElement.style.maxHeight = null;
    } else {
      panelElement.style.maxHeight = panelElement.scrollHeight + "px";
    }
  });
}

function getMaxItemPrice() {
  const prices = items.map((item) => {
    return item.price;
  });

  return prices.reduce((prevValue, currentValue) => {
    return prevValue < currentValue ? currentValue : prevValue;
  });
}

function getMinItemPrice() {
  const prices = items.map((item) => {
    return item.price;
  });

  return prices.reduce((prevValue, currentValue) => {
    return prevValue > currentValue ? currentValue : prevValue;
  });
}

function normalizePriceInput(inputElement) {
  if (inputElement.value < MIN_PRICE) {
    inputElement.value = MIN_PRICE;
  } else if (inputElement.value > MAX_PRICE) {
    inputElement.value = MAX_PRICE;
  }
}

export default function initCatalog() {
  window.openModal = openModal;

  for (let accordionButton of accordionButtons) {
    let panel = accordionButton.nextElementSibling;
    applyOpenPanelEvent(accordionButton, panel);
  }

  modalElement.addEventListener('click', (event) => {
    if (event.target == modalElement) {
      modalElement.classList.add('closed');
    }
  });

  searchInput.addEventListener('input', (event) => {
    filters.searchText = searchInput.value;
    filtersUpdated();
  });


  let priceFromInput = document.getElementById('price-from');
  priceFromInput.value = MIN_PRICE;
  priceFromInput.addEventListener('change', () => {

    normalizePriceInput(priceFromInput);

    filters.price.from = priceFromInput.value;
    filtersUpdated();
  });

  let priceToInput = document.getElementById('price-to');
  priceToInput.value = MAX_PRICE;
  priceToInput.addEventListener('change', () => {

    normalizePriceInput(priceToInput);

    filters.price.to = priceToInput.value;
    filtersUpdated();
  });

  filtersUpdated();
}