"use strict";

const searchElem = document.querySelector(".js-search");
const containerElem = document.querySelector(".js-container");
const favContainerElem = document.querySelector(".js-favContainer");
const searchButton = document.querySelector(".js-searchButton");
const resetButton = document.querySelector(".js-resetButton");

const APIPath = "https://api.jikan.moe/v3/search/anime?q=";

let showsArray = [];
let favShowsArray = [];
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

function renderImage(div, show, container) {
  const divImg = document.createElement("div");
  divImg.classList.add("image--preview");
  div.appendChild(divImg);
  // console.log(show.image_url);
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
  renderSynopsis(div, show, divImg, container);
}

function renderSynopsis(div, show, divImg, container) {
  const synopsisElem = document.createElement("p");
  const synopsis = document.createTextNode(show.synopsis);
  synopsisElem.classList.add("synopsis--preview", "hidden");
  synopsisElem.appendChild(synopsis);
  divImg.appendChild(synopsisElem);
  container.appendChild(div);
}

function renderShows() {
  containerElem.innerHTML = "";
  for (const eachShow of showsArray) {
    const eachShowContainer = document.createElement("div");
    eachShowContainer.classList.add("show--preview");
    eachShowContainer.setAttribute("data-id", eachShow.mal_id);
    renderTitle(eachShowContainer, eachShow);
    renderImage(eachShowContainer, eachShow, containerElem);
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

function renderFavList() {
  favContainerElem.innerHTML = "";
  for (const eachShow of favShowsArray) {
    const eachShowContainer = document.createElement("div");
    eachShowContainer.classList.add("fav--show--preview");
    renderTitle(eachShowContainer, eachShow);
    renderImage(eachShowContainer, eachShow, favContainerElem);
  }
}

function saveToLS() {
  localStorage.setItem("favShowsArrayLS", JSON.stringify(favShowsArray));
}

function saveAsFavorite(event) {
  const showFavId = parseInt(event.currentTarget.dataset.id);
  const showFound = showsArray.find((show) => show.mal_id === showFavId);
  const showFavIndex = favShowsArray.findIndex(
    (favShow) => favShow.mal_id === showFavId
  );
  if (event.currentTarget.classList.contains("favorite")) {
    favShowsArray.push(showFound);
  } else {
    favShowsArray.splice(showFavIndex, 1);
  }
  saveToLS();
}

function handleShowClick(event) {
  setAsFavorite(event);
  saveAsFavorite(event);
  renderFavList();
}

function handleResetButtonClick(event) {
  //   event.preventDefault();
  console.log("Has clickado en reset");
}

function getDataLS() {
  const favShowsArrayLS = JSON.parse(localStorage.getItem("favShowsArrayLS"));
  favShowsArray = favShowsArrayLS;
  if (favShowsArrayLS !== "null") {
    renderFavList();
    console.log("Desde el LS");
  }
}

getDataLS();

searchButton.addEventListener("click", handleSearchButtonClick);
resetButton.addEventListener("click", handleResetButtonClick);
