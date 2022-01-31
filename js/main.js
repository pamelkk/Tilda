"use strict";

const productList = document.querySelector(".page-main__product");
const cardTemplate = document.querySelector("#card").content.querySelector('.product');
const buttonAdd = productList.querySelector("button");
const buttonArrow = productList.querySelector(".page-main__product-arrow");
const cart = document.querySelector(".page-header-cart");
const photos = document.querySelector(".product__photos");
const IMG_CARD_WIDTH = 200 + `px`;
const IMG_CARD_HEIGHT = 150 + `px`;
const IMG_BIG_CARD_WIDTH = 500 + `px`;
const IMG_BIG_CARD_HEIGHT = 350 + `px`;
const popup = document.getElementsByClassName("popup")[0];
const rating = document.querySelector('.rating');
const ratingItem = document.querySelectorAll('.rating__wrapper-item');
const ratingBadItem = document.querySelectorAll('.rating__wrapper-item--bad');
const ratingPopup = document.querySelector('.rating-popup');
const ratingPopupClose = document.querySelector('.rating-popup__wrapper-close');
const ESC_KEYCODE = 27
const popupGoodRate = document.getElementsByClassName("popup-awesome")[0];



fetch('https://store.tildacdn.com/api/tgetproduct/')
  .then((response) => response.json())
  .then((info) => {
    info.images = JSON.parse(info.images)
    renderCard(info);

    const bigPhotoPlace = document.querySelector("#big");
    bigPhotoPlace.alt = `Goods' photo`;
    bigPhotoPlace.style.width = IMG_BIG_CARD_WIDTH;
    bigPhotoPlace.style.height = IMG_BIG_CARD_HEIGHT;
    bigPhotoPlace.src = getRandomElement(info.images).img;
  })

function getRandomElement(elements) {
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  return randomElement;
}

function renderCard(futureCard) {
  const similarListFragment = document.createDocumentFragment();

  const cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector(".product__title").textContent = futureCard.title;
  cardElement.querySelector(".product__descr").textContent = futureCard.descr;
  cardElement.querySelector(".product__price").textContent = futureCard.price + " rubles";
  cardElement.querySelector(".product__priceold").textContent = futureCard.priceold + " rubles";
  cardElement.querySelector(".product__quantity").textContent = futureCard.quantity + " pcs in stock";

  function getPhotoItems(items) {
    const photoItems = [];
    for (const item of items) {
      const photoItemElement = document.createElement(`img`);
      photoItemElement.classList.add(`product__photos-photo`);
      photoItemElement.src = item.img;
      photoItemElement.style.width = IMG_CARD_WIDTH;
      photoItemElement.style.height = IMG_CARD_HEIGHT;
      photoItemElement.alt = `Goods' photo`;
      photoItems.push(photoItemElement);
    }
    return photoItems;
  };

  function renderPhotos(elements) {
    const fragmentPhotoElement = document.createDocumentFragment();
    elements.forEach(function (element) {
      fragmentPhotoElement.appendChild(element)
    });
    return fragmentPhotoElement;
  }

  const cardPhotosElements = renderPhotos(getPhotoItems(futureCard.images));
  cardElement.querySelector(`.product__photos-mini`).appendChild(cardPhotosElements);

  similarListFragment.appendChild(cardElement);
  productList.appendChild(similarListFragment);

  const photEl = cardElement.querySelector(`.product__photos`);
  const photoList = photEl.querySelectorAll('img')

  function clickToIncrease(clickedPhoto, bigPhoto) {
    bigPhoto.src = clickedPhoto.src;
    bigPhoto.alt = `Goods' photo`;
    bigPhoto.style.width = IMG_BIG_CARD_WIDTH;
    bigPhoto.style.height = IMG_BIG_CARD_HEIGHT;
  }

  photoList.forEach(function (photoElement) {
    photoElement.addEventListener("click", function (e) {
      const bigPhotoPlace = document.querySelector("#big");

      clickToIncrease(e.currentTarget, bigPhotoPlace);
    });
  });
};

function moveArrow() {
  buttonArrow.classList.add('page-main__product-arrow--down');
}

function dontMoveArrow() {
  buttonArrow.classList.remove('page-main__product-arrow--down');
}

document.addEventListener("mouseenter", moveArrow);
document.addEventListener("mouseleave", dontMoveArrow);

function addToCart() {
  cart.classList.add('page-header-cart--full')
}

buttonAdd.addEventListener("click", addToCart);

const openModal = () => {
  popup.classList.add("popup--opened");
  setTimeout(() => {
    popup.classList.remove("popup--opened");
  }, 1400);
}

rating.onclick = function (e) {
  let target = e.target;

  if (target.classList.contains("rating__wrapper-item")) {
    removeClass(ratingItem, 'current-active')
    target.classList.add('active', 'current-active');
    rating.classList.add('rating--disabled');
  }
}

rating.onmouseover = function (e) {
  let target = e.target;

  if (target.classList.contains("rating__wrapper-item")) {
    removeClass(ratingItem, 'active')
    target.classList.add('active');
    mouseOverActiveClass(ratingItem)
  }
}

rating.onmouseout = function () {
  addClass(ratingItem, 'active')
  mouseOutActiveClass(ratingItem)
}

function removeClass(arr) {
  for (let i = 0, iLen = arr.length; i < iLen; i++) {
    for (let j = 1; j < arguments.length; j++) {
      ratingItem[i].classList.remove(arguments[j])
    }
  }
}

function addClass(arr) {
  for (let i = 0, iLen = arr.length; i < iLen; i++) {
    for (let j = 1; j < arguments.length; j++) {
      ratingItem[i].classList.add(arguments[j])
    }
  }
}

function mouseOverActiveClass(arr) {
  for (let i = 0, iLen = arr.length; i < iLen; i++) {
    if (arr[i].classList.contains('active')) {
      break;
    } else {
      arr[i].classList.add('active');
    }
  }
}

function mouseOutActiveClass(arr) {
  for (let i = arr.length - 1; i >= 1; i--) {
    if (arr[i].classList.contains('current-active')) {
      break;
    } else {
      arr[i].classList.remove('active');
    }
  }
}

ratingPopupClose.addEventListener('click', function () {
  if (ratingPopup.classList.contains('rating-popup--opened')) {
    ratingPopup.classList.remove('rating-popup--opened')
  }
})

document.addEventListener('keydown', function (e) {
  if (e.keyCode === ESC_KEYCODE & ratingPopup.classList.contains('rating-popup--opened')) {
    ratingPopup.classList.remove('rating-popup--opened')
  }
})


function clickForBadRate(popup, target) {
  if (!popup.classList.contains('rating-popup--opened')) {
    popup.classList.add('rating-popup--opened')
  }
}

window.addEventListener("click", function (e) {
  if (e.target == ratingPopup) {
    ratingPopup.classList.remove("rating-popup--opened");
  }
});

ratingBadItem.forEach(function (element) {
  element.addEventListener("click", function (e) {
    clickForBadRate(ratingPopup, e.currentTarget)
  });
});

const openModalGoodRate = () => {
  popupGoodRate.classList.add("popup-awesome--opened");
  setTimeout(() => {
    popupGoodRate.classList.remove("popup-awesome--opened");
  }, 1400);
}