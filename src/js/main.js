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

function renderTitle(div, show) {
  const titleElem = document.createElement("h4");
  const title = document.createTextNode(show.title);
  titleElem.classList.add("title--preview");
  titleElem.appendChild(title);
  div.appendChild(titleElem);
}

function renderImage(div, show) {
  const divImg = document.createElement("div");
  divImg.classList.add("image--preview");
  div.appendChild(divImg);
  console.log(show.image_url);
  // if (show.image_url !== "") {
    divImg.setAttribute("style", `background-image:url(${show.image_url})`);
  // } else {
  //   const noImgMessageElem = document.createElement("p");
  //   const noImgMessage = document.createTextNode(
  //     "No existe una imagen disponible"
  //   );
  //   noImgMessageElem.appendChild(noImgMessage);
  //   divImg.appendChild(noImgMessageElem);
  // }
  renderSynopsis(div, show, divImg);
}

function renderSynopsis(div, show, divImg) {
  const synopsisElem = document.createElement("p");
  const synopsis = document.createTextNode(show.synopsis);
  synopsisElem.classList.add("synopsis--preview", "hidden");
  synopsisElem.appendChild(synopsis);
  divImg.appendChild(synopsisElem);
  containerElem.appendChild(div);
}

function renderShows() {
  containerElem.innerHTML = "";
  for (const eachShow of showsArray) {
    const eachShowContainer = document.createElement("div");
    eachShowContainer.classList.add("show--preview");
    renderTitle(eachShowContainer, eachShow);
    renderImage(eachShowContainer, eachShow);
    eachShowContainer.addEventListener("click", handleShowClick);
  }
}

function getDataApi() {
  fetch(APIPath + searchValue)
    .then((response) => response.json())
    .then((data) => {
      showsArray = data.results;
      renderShows();
    });
}

function handleSearchButtonClick(event) {
  event.preventDefault();
  getSearchValue();
  getDataApi();
}

function setAsFavorite(event) {
  const selectedShow = event.currentTarget;
  selectedShow.classList.toggle("favorite");
}

function saveAsFavorite(event) {
  console.log(`guardada como favorita:${event.currentTarget.textContent}`);
}

function handleShowClick(event) {
  setAsFavorite(event);
  saveAsFavorite(event);
}

function handleResetButtonClick(event) {
  //   event.preventDefault();
  console.log("Has clickado en reset");
}

searchButton.addEventListener("click", handleSearchButtonClick);
resetButton.addEventListener("click", handleResetButtonClick);
