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
  let imgUrl = "";
  let btnClass = "";
  let textReviews = getReviewsAsText(item.orderInfo.reviews);
  let ordersDone = Math.floor(Math.random() * 10000);

  if (orderStock == 0) {
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
        <button onclick="openModal(${item.id})" class="${btnClass}">Add to cart</button>
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

function renderModal(item) {

  let orderStock = item.orderInfo.inStock;
  let reviews = item.orderInfo.reviews;
  let textReviews = getReviewsAsText(item.orderInfo.reviews);
  let ordersDone = Math.floor(Math.random() * 10000);

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
                <span class="str-text">${ordersDone}</span>
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
                <button class="btn-modal">Add to cart</button>
            </div>
    </div>
  `;
}

let modalElement = document.getElementById('modal');

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

modalElement.addEventListener('click', (event) => {
  if (event.target == modalElement) {
    modalElement.classList.add('closed');
  }
})

renderItems(items);