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
    containerElem.innerHTML += `<p>${eachShow.title}</p> <img src=${eachShow.image_url}>`;
  }
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
