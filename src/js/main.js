"use strict";

const containerElem = document.querySelector(".js-container");
const favContainerElem = document.querySelector(".js-favContainer");

const APIPath = "https://api.jikan.moe/v3/search/anime?q=";

let showsArray = [];
let favShowsArray = [];
let searchValue = "";

// start app function
function startApp() {
  getDataLS();
  const searchButton = document.querySelector(".js-searchButton");
  const resetButton = document.querySelector(".js-resetButton");
  addListener(searchButton, handleSearchButtonClick);
  addListener(resetButton, handleResetButtonClick);
}

// get data from ls
function getDataLS() {
  const favShowsArrayLS = JSON.parse(localStorage.getItem("favShowsArrayLS"));
  if (favShowsArrayLS !== null) {
    favShowsArray = favShowsArrayLS;
    renderFavList();
  }
}

// get user value after click and render results
function handleSearchButtonClick(event) {
  event.preventDefault();
  showsArray = [];
  getSearchValue();
  if (searchValue === "") {
    renderErrorMessage("Venga, busca algo.");
  } else if (searchValue.length < 3) {
    renderErrorMessage("Introduce al menos 3 caracteres.");
  } else {
    getDataApi().then(() => {
      if (showsArray.length === 0) {
        renderErrorMessage("No hemos encontrado resultados con esa búsqueda.");
      } else {
        renderResults();
      }
    });
  }
}

// set as favorite after click and render fav list
function handleShowClick(event) {
  renderAsFavorite(event);
  saveAsFavorite(event);
  saveToLS();
  renderFavList();
}

// delete from favorites one by one
function handleRemoveFavClick(event) {
  removeFavFromArray(event);
  saveToLS();
  renderFavList();
}

// delete all favorites
function handleResetButtonFavClick() {
  favShowsArray = [];
  saveToLS();
  renderFavList();
  renderResults();
}

// delete all results
function handleResetButtonClick() {
  showsArray = [];
  containerElem.innerHTML = "";
}

// -----------------------------------------------------------------------------

function renderFavList() {
  favContainerElem.innerHTML = "";
  if (favShowsArray.length !== 0) {
    for (const eachShow of favShowsArray) {
      renderShowPreviewFav(eachShow);
    }
    const resetButtonFav = renderResetButtonFav();
    addListener(resetButtonFav, handleResetButtonFavClick);
  }
}

function renderShowPreviewFav(show) {
  const eachShowContainer = document.createElement("div");
  eachShowContainer.classList.add("show--preview__fav");
  eachShowContainer.setAttribute("data-id", show.mal_id);
  renderTitle(eachShowContainer, show);
  renderImage(eachShowContainer, show);
  favContainerElem.appendChild(eachShowContainer);
  const removeFavIcon = renderRemoveFavIcon(eachShowContainer);
  addListener(removeFavIcon, handleRemoveFavClick);
}

function renderTitle(container, show) {
  const titleElem = document.createElement("h4");
  const title = document.createTextNode(show.title);
  titleElem.classList.add("preview--title");
  titleElem.appendChild(title);
  container.appendChild(titleElem);
}

function renderImage(container, show) {
  const divImg = document.createElement("div");
  divImg.classList.add("preview--image");
  const placeholderAPI =
    "https://cdn.myanimelist.net/images/qm_50.gif?s=e1ff92a46db617cb83bfc1e205aff620";
  if (show.image_url === placeholderAPI) {
    divImg.setAttribute(
      "style",
      `background-image:url("./assets/images/placeholderBuscanime.png")`
    );
  } else {
    divImg.setAttribute("style", `background-image:url(${show.image_url})`);
  }
  container.appendChild(divImg);
  return divImg;
}

function renderSynopsis(container, show) {
  const synopsisElem = document.createElement("p");
  const synopsis = document.createTextNode(show.synopsis);
  synopsisElem.classList.add("preview--synopsis", "hidden");
  synopsisElem.appendChild(synopsis);
  container.appendChild(synopsisElem);
}

function renderRemoveFavIcon(container) {
  const removeFavIcon = document.createElement("i");
  removeFavIcon.classList.add("far", "fa-times-circle", "fav--remove__icon");
  container.appendChild(removeFavIcon);
  return removeFavIcon;
}

function addListener(element, handler) {
  element.addEventListener("click", handler);
}

function renderResetButtonFav() {
  const resetButtonFav = document.createElement("input");
  resetButtonFav.setAttribute("type", "reset");
  resetButtonFav.setAttribute("value", "Limpiar favoritos");
  resetButtonFav.classList.add("main--buttonFav");
  favContainerElem.appendChild(resetButtonFav);
  return resetButtonFav;
}

function getSearchValue() {
  const searchElem = document.querySelector(".js-search");
  searchValue = searchElem.value.toLowerCase();
}

function renderErrorMessage(message) {
  containerElem.innerHTML = "";
  const errorContainer = document.createElement("p");
  errorContainer.classList.add("container--shows__error");
  const errorMessage = document.createTextNode(message);
  errorContainer.appendChild(errorMessage);
  containerElem.appendChild(errorContainer);
}

function getDataApi() {
  return fetch(APIPath + searchValue)
    .then((response) => response.json())
    .then((data) => {
      showsArray = data.results.map((item) => createShowObject(item));
    });
}

function createShowObject(item) {
  const showObject = {};
  showObject.mal_id = item.mal_id;
  showObject.title = item.title;
  showObject.image_url = item.image_url;
  showObject.synopsis = item.synopsis;
  return showObject;
}

function renderResults() {
  containerElem.innerHTML = "";
  renderShows();
}

function renderShows() {
  for (const eachShow of showsArray) {
    const eachShowContainer = renderContainer(eachShow);
    renderTitle(eachShowContainer, eachShow);
    renderImage(eachShowContainer, eachShow);
    renderSynopsis(eachShowContainer, eachShow);
    containerElem.appendChild(eachShowContainer);
    addListener(eachShowContainer, handleShowClick);
    checkIfFavorite(eachShow, eachShowContainer);
  }
}

function renderContainer(show) {
  const eachShowContainer = document.createElement("div");
  eachShowContainer.classList.add("show--preview");
  eachShowContainer.setAttribute("data-id", show.mal_id);
  eachShowContainer.addEventListener("mouseover", handleImgMouseover);
  eachShowContainer.addEventListener("mouseleave", handleImgMouseleave);
  return eachShowContainer;
}

function handleImgMouseover(event) {
  const eachShowContainer = event.currentTarget;
  const img = eachShowContainer.querySelector(".preview--image");
  const synopsisElem = eachShowContainer.querySelector(".preview--synopsis");
  img.classList.add("opaque");
  synopsisElem.classList.remove("hidden");
}

function handleImgMouseleave(event) {
  const eachShowContainer = event.currentTarget;
  const img = eachShowContainer.querySelector(".preview--image");
  const synopsisElem = eachShowContainer.querySelector(".preview--synopsis");
  img.classList.remove("opaque");
  synopsisElem.classList.add("hidden");
}

function checkIfFavorite(eachShow, eachShowContainer) {
  const foundInFavArray = favShowsArray.find(
    (eachFavShow) => eachFavShow.mal_id === eachShow.mal_id
  );
  if (foundInFavArray !== undefined) {
    eachShowContainer.classList.add("favorite");
  }
}

function renderAsFavorite(event) {
  const selectedShow = event.currentTarget;
  selectedShow.classList.toggle("favorite");
}

function saveAsFavorite(event) {
  const showFavId = parseInt(event.currentTarget.dataset.id);
  const showFound = findIdInArray(showsArray, showFavId);
  const showFavIndex = findIndexIdInArray(favShowsArray, showFavId);
  if (event.currentTarget.classList.contains("favorite")) {
    favShowsArray.push(showFound);
  } else {
    favShowsArray.splice(showFavIndex, 1);
  }
}

function findIdInArray(arr, id) {
  return arr.find((show) => show.mal_id === id);
}

function findIndexIdInArray(arr, id) {
  return arr.findIndex((show) => show.mal_id === id);
}

function saveToLS() {
  localStorage.setItem("favShowsArrayLS", JSON.stringify(favShowsArray));
}

function removeFavFromArray(event) {
  const showFavId = parseInt(event.currentTarget.parentNode.dataset.id);
  const showFavIndex = findIndexIdInArray(favShowsArray, showFavId);
  favShowsArray.splice(showFavIndex, 1);
  setAsNotFavorite(showFavId);
}

function setAsNotFavorite(showFavId) {
  if (showsArray.length !== 0) {
    const showPreviewFavs = document.querySelectorAll(".favorite");
    const showPreviewFavsArr = Array.from(showPreviewFavs);
    const resultsFavShow = showPreviewFavsArr.find(
      (eachShow) => parseInt(eachShow.dataset.id) === showFavId
    );
    if (resultsFavShow !== undefined) {
      resultsFavShow.classList.remove("favorite");
    }
  }
}

// start app
startApp();
