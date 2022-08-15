import customSelect from 'custom-select';
import items, { getItemsCategories } from './items.js';
import {
  isItemLiked,
  toggleLikedItem
} from './likedItems.js';
import {
  addItemToCart
} from './shoppingCart.js';

let accordionButtons = document.getElementsByClassName("accordion");
let modalElement = document.getElementById('modal');
let searchInput = document.getElementById('search-input');
let colorCheckBoxes = document.getElementsByClassName('color-checkbox');
let storageCheckBoxes = document.getElementsByClassName('storage-checkbox');
let osCheckBoxes = document.getElementsByClassName('os-checkbox');
let displayCheckBoxes = document.getElementsByClassName('display-checkbox');


const MAX_PRICE = getMaxItemPrice();
const MIN_PRICE = getMinItemPrice();

const IN_STOCK_FILTER_STATUS = 'in-stock';
const OUT_OF_STOCK_FILTER_STATUS = 'out-of-stock';

let filters = {
  searchText: '',
  price: {
    from: MIN_PRICE,
    to: MAX_PRICE,
  },
  colors: [],
  storage: [],
  os: [],
  display: [],
  sortDirection: '',
  stockStatus: '',
  category: '',
};

function getReviewsAsText(reviews) {
  if (reviews >= 50) {
    return "Above average";
  } else if (reviews <= 15) {
    return "Shit";
  }

  return "Below average";
}

function onLikeClick(id) {
  toggleLikedItem(id);
  filtersUpdated();
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

  let likeImgSrc = "";
  if (isItemLiked(item.id)) {
    likeImgSrc = "img/icons/likefull.svg";
  } else {
    likeImgSrc = "img/icons/like1.svg";
  }

  return `
    <div class="item-card">
      <img onclick="onLikeClick(${item.id})" src="${likeImgSrc}" class="like-img" width="20px" alt="like">

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
                <span class="about">Color:<span class="about-text">${item.color.join(', ')}</span></span>
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
                <button onclick="addItemToCartFromCatalog(${item.id})" class="${btnClass}" ${isDisabled ? 'disabled' : ''}>Add to cart</button>
            </div>
    </div>
  `;
}

function openModal(id) {
  let item = items.find((element) => id == element.id);

  modalElement.innerHTML = renderModal(item);

  modalElement.classList.remove('closed');
}

function closeModal() {
  modalElement.classList.add('closed');
}

function addItemToCartFromCatalog(id) {
  addItemToCart(id);
  closeModal();
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

  if (filters.colors.length != 0) {
    filteredItems = filteredItems.filter((item) => {
      for (let colorCode of filters.colors) {
        if (item.color.includes(colorCode)) {
          return true;
        }
      }

      return false;
    });
  }

  if (filters.storage.length != 0) {
    filteredItems = filteredItems.filter((item) => {
      return filters.storage.includes(item.storage);
    });
  }

  if (filters.os.length != 0) {
    filteredItems = filteredItems.filter((item) => {
      return filters.os.includes(item.os);
    })
  }

  if (filters.display.length != 0) {
    filteredItems = filteredItems.filter((item) => {
      if (item.display === null) {
        return false;
      }

      for (let rangeItem of filters.display) {
        if (rangeItem.min <= item.display && (rangeItem.max === null || item.display <= rangeItem.max)) {
          return true;
        }
      }

      return false;
    });
  }

  if (filters.stockStatus == IN_STOCK_FILTER_STATUS) {
    filteredItems = filteredItems.filter((item) => {
      return item.orderInfo.inStock > 0;
    });
  } else if (filters.stockStatus == OUT_OF_STOCK_FILTER_STATUS) {
    filteredItems = filteredItems.filter((item) => {
      return item.orderInfo.inStock == 0;
    });
  }

  if (filters.category != ""){
    filteredItems = filteredItems.filter((item) => {
      return item.category == filters.category;
    });
  }

  if (filters.sortDirection == 'asc') {
    filteredItems.sort((a, b) => {
      return a.price > b.price;
    });
  } else if (filters.sortDirection == 'desc') {
    filteredItems.sort((a, b) => {
      return a.price < b.price;
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

function checkColorFilters(checkboxElement) {
  if (checkboxElement.checked) {
    addColorToFilters(checkboxElement.dataset.code);
  } else {
    removeColorFromFilters(checkboxElement.dataset.code);
  }
}

function addColorToFilters(colorCode) {
  filters.colors.push(colorCode)
}

function removeColorFromFilters(colorCode) {
  let pos = filters.colors.indexOf(colorCode);
  if (pos != -1) {
    filters.colors.splice(pos, 1);
  }
}

function checkMemoryFilters(checkboxElement) {
  if (checkboxElement.checked) {
    addMemoryToFilters(checkboxElement.dataset.memory);
  } else {
    removeMemoryFromFilters(checkboxElement.dataset.memory);
  }
}

function addMemoryToFilters(memory) {
  filters.storage.push(Number(memory));
}

function removeMemoryFromFilters(memory) {
  let pos = filters.storage.indexOf(Number(memory));
  if (pos != -1) {
    filters.storage.splice(pos, 1);
  }
}

function checkOsFilters(checkboxElement) {
  if (checkboxElement.checked) {
    addOsToFilters(checkboxElement.dataset.os);
  } else {
    removeOsFromFilters(checkboxElement.dataset.os);
  }
}

function addOsToFilters(osCode) {
  filters.os.push(osCode);
}

function removeOsFromFilters(osCode) {
  let pos = filters.os.indexOf(osCode);
  if (pos != -1) {
    filters.os.splice(pos, 1);
  }
}

function checkDisplayFilters(checkboxElement) {
  if (checkboxElement.checked) {
    addDisplayToFilters(
      checkboxElement.dataset.displayMin,
      checkboxElement.dataset.displayMax,
    );
  } else {
    removeDisplayFromFilters(
      checkboxElement.dataset.displayMin,
      checkboxElement.dataset.displayMax,
    );
  }
}

function addDisplayToFilters(displayMin, displayMax) {
  const min = Number(displayMin);
  const max = displayMax != '' ? Number(displayMax) : null;

  const displayRange = {
    min: min,
    max: max,
  };

  filters.display.push(displayRange);
}

function removeDisplayFromFilters(displayMin, displayMax) {
  const min = Number(displayMin);
  const max = displayMax != '' ? Number(displayMax) : null;

  const pos = filters.display.findIndex((rangeItem) => {
    if (rangeItem.min === min && rangeItem.max === max) {
      return true;
    }
    return false;
  });

  if (pos != -1) {
    filters.display.splice(pos, 1);
  }
}

function toggleSearchFilters() {
  const bannerSearchFilter = document.querySelector('.banner-search-filter');
  const openBannerSearchFilterButton = document.querySelector('#open-banner-search-filter');

  bannerSearchFilter.classList.toggle('show');
  openBannerSearchFilterButton.classList.toggle('active');
}

function hideSearchFilters() {
  const bannerSearchFilter = document.querySelector('.banner-search-filter');
  const openBannerSearchFilterButton = document.querySelector('#open-banner-search-filter');

  bannerSearchFilter.classList.remove('show');
  openBannerSearchFilterButton.classList.remove('active');
}

function toggleSearchOrder() {
  const bannerSearchOrder = document.querySelector('.banner-search-order');
  const openBannerSearchOrderButton = document.querySelector('#open-banner-search-order');

  bannerSearchOrder.classList.toggle('show');
  openBannerSearchOrderButton.classList.toggle('active');
}

function hideSearchOrder() {
  const bannerSearchOrder = document.querySelector('.banner-search-order');
  const openBannerSearchOrderButton = document.querySelector('#open-banner-search-order');

  bannerSearchOrder.classList.remove('show');
  openBannerSearchOrderButton.classList.remove('active');
}

function initBannerSearch() {
  const openBannerSearchFilterButton = document.querySelector('#open-banner-search-filter');
  const openBannerSearchOrderButton = document.querySelector('#open-banner-search-order');
  const searchOrderButtons = document.querySelectorAll('.banner-search-order .button');

  openBannerSearchFilterButton.addEventListener('click', () => {
    hideSearchOrder();
    toggleSearchFilters();
  });

  openBannerSearchOrderButton.addEventListener('click', () => {
    hideSearchFilters();
    toggleSearchOrder();
  });

  searchOrderButtons.forEach((element) => {
    element.addEventListener('click', () => {

      if (element.classList.contains('is-active')) {
        return;
      }

      searchOrderButtons.forEach((element) => {
        element.classList.remove('is-active');
      });
      element.classList.add('is-active');
      filters.sortDirection = element.dataset.dir;

      filtersUpdated();
    })
  });
}

function initMainFilters() {
  for (let accordionButton of accordionButtons) {
    let panel = accordionButton.nextElementSibling;
    applyOpenPanelEvent(accordionButton, panel);
  }

  modalElement.addEventListener('click', (event) => {
    if (event.target == modalElement) {
      closeModal();
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

  for (let colorCheckBox of colorCheckBoxes) {
    colorCheckBox.addEventListener('change', (event) => {
      checkColorFilters(event.currentTarget);
      filtersUpdated();
    });

    checkColorFilters(colorCheckBox);
  }

  for (let storageCheckBox of storageCheckBoxes) {
    storageCheckBox.addEventListener('change', (event) => {
      checkMemoryFilters(event.currentTarget);
      filtersUpdated();
    });

    checkMemoryFilters(storageCheckBox);
  }

  for (let osCheckBox of osCheckBoxes) {
    osCheckBox.addEventListener('change', (event) => {
      checkOsFilters(event.currentTarget);
      filtersUpdated();
    });

    checkOsFilters(osCheckBox);
  }

  for (let displayCheckBox of displayCheckBoxes) {
    displayCheckBox.addEventListener('change', (event) => {
      checkDisplayFilters(event.currentTarget);
      filtersUpdated();
    });
    checkDisplayFilters(displayCheckBox);
  }
}

function initSearchFilters() {
  const stockSelectElement = document.getElementById('stock-select');
  customSelect(stockSelectElement);
  stockSelectElement.addEventListener('change', () => {
    filters.stockStatus = stockSelectElement.value;
  });

  const categorySelectElement = document.getElementById('category-select');
  const categories = getItemsCategories();
  categories.forEach((category) => {
    const opt = document.createElement('option');
    opt.value = category;
    opt.innerHTML = category;
    categorySelectElement.appendChild(opt);
  })
  customSelect(categorySelectElement);
  categorySelectElement.addEventListener('change', () => {
    filters.category = categorySelectElement.value;
  });


  const submitFilters = document.getElementById('search-filters-submit');
  submitFilters.addEventListener('click', () => {
    filtersUpdated();
    hideSearchFilters();
  });
}

function initDomEvents() {
  initBannerSearch();
  initMainFilters();
  initSearchFilters();
}

export default function initCatalog() {
  window.openModal = openModal;
  window.addItemToCartFromCatalog = addItemToCartFromCatalog;
  window.onLikeClick = onLikeClick;
  initDomEvents();
  filtersUpdated();
}