"use strict";

const searchElem = document.querySelector(".js-search");
const containerElem = document.querySelector(".js-container");
const searchButton = document.querySelector(".js-searchButton");
const resetButton = document.querySelector(".js-resetButton");

const APIPath = "https://api.jikan.moe/v3/search/anime?q=";

let showsArray = [];
let searchValue = "";

function getSearchValue() {
  searchValue = searchElem.value.toLowerCase();
}

function getDataApi() {
  fetch(APIPath + searchValue)
    .then((response) => response.json())
    .then((data) => {
      showsArray = data.results;
      renderShows();
    });
}

function renderShows() {
  containerElem.innerHTML = "";
  for (const eachShow of showsArray) {
    const eachShowContainer = document.createElement("div");
    eachShowContainer.classList.add("show--preview");
    renderTitle(eachShowContainer, eachShow);
    renderImage(eachShowContainer, eachShow);
  }
}

function renderTitle(div, show) {
  const titleElem = document.createElement("h4");
  const title = document.createTextNode(show.title);
  titleElem.appendChild(title);
  div.appendChild(titleElem);
}

function renderImage(div, show) {
  const img = document.createElement("img");
  img.src = show.image_url;
  div.appendChild(img);
  containerElem.appendChild(div);
}

function handleSearchButtonClick(event) {
  event.preventDefault();
  getSearchValue();
  getDataApi();
}

function handleResetButtonClick(event) {
  //   event.preventDefault();
  console.log("Has clickado en reset");
}

searchButton.addEventListener("click", handleSearchButtonClick);
resetButton.addEventListener("click", handleResetButtonClick);
