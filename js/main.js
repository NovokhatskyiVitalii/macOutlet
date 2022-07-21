let acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

let openFilter = document.getElementById("open-filter");
let filters = document.getElementById("filters");

openFilter.addEventListener('click', function () {
  filters.classList.toggle("closed");
})

function renderItem(item) {
  let orderStock = item.orderInfo.inStock;
  let imgUrl = "";
  let btnClass = "";
  let reviews = item.orderInfo.reviews;
  let textReviews = "";
  let ordersDone = Math.floor(Math.random() * 10000);

  if (orderStock == 0) {
    imgUrl = "img/icons/logo-check-noitems.svg"
    btnClass = "card-btn disabled"
  } else {
    imgUrl = "img/icons/check-icon.svg"
    btnClass = "card-btn"
  }

  if (reviews >= 50) {
    textReviews = "Above average";
  } else if (reviews <= 15) {
    textReviews = "Shit";
  } else {
    textReviews = "Below average";
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
        <button class="${btnClass}">Add to cart</button>
      </div>
      <div class="stats-card">
        <div class="like-stats-img">
          <img src="img/icons/likefull.svg" alt="">
        </div>
        <div class="stats-text color-txt-stats">
          <span><span class="str-text">${reviews}%</span> Positive reviews</span>
          <span>${textReviews}</span>
        </div>
        <div class="orders color-txt-stats">
          <span class="str-text">${ordersDone}</span>
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

renderItems(items);

