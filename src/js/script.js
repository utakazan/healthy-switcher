let nav = document.querySelector('.header__nav');
let headerBtn = document.querySelector('.header__btn');
let btnIcon = document.querySelector('.hamburger');

let menuBtn = document.querySelector('.menu__btn');
let menuList = document.querySelector('.menu__list');

nav.classList.remove('header__nav--nojs');
headerBtn.classList.remove('header__btn--nojs');

headerBtn.onclick = function() {
  nav.classList.toggle('header__nav--opened');
  btnIcon.classList.toggle('hamburger--open');
};

menuBtn.onclick = function() {
  menuList.classList.remove('menu__list--hidden');
  menuBtn.classList.toggle('menu__btn--hidden');
}

