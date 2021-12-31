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
  titleElem.classList.add("preview--title");
  titleElem.appendChild(title);
  div.appendChild(titleElem);
}

function renderImage(div, show, container) {
  const divImg = document.createElement("div");
  divImg.classList.add("preview--image");
  div.appendChild(divImg);
  divImg.setAttribute("style", `background-image:url(${show.image_url})`);
  renderSynopsis(div, show, divImg, container);
}

function renderSynopsis(div, show, divImg, container) {
  const synopsisElem = document.createElement("p");
  const synopsis = document.createTextNode(show.synopsis);
  synopsisElem.classList.add("preview--synopsis", "hidden");
  synopsisElem.appendChild(synopsis);
  divImg.appendChild(synopsisElem);
  container.appendChild(div);
}

// revisar función
function checkIfFavorite(eachShow) {
  if (favShowsArray !== []) {
    const foundInFavArray = favShowsArray.find(
      (eachFavShow) => eachFavShow.mal_id === eachShow.mal_id
    );
    if (foundInFavArray !== undefined) {
      const results = document.querySelectorAll(".show--preview");
      const resultsArray = Array.from(results);
      for (const eachShow of resultsArray) {
        if (parseInt(eachShow.dataset.id) === foundInFavArray.mal_id) {
          eachShow.classList.add("favorite");
        }
      }
    }
  }
}

function renderErrorMessage() {
  const errorContainer = document.createElement("p");
  const errorMessage = document.createTextNode(
    "No hemos encontrado resultados con esa búsqueda."
  );
  errorContainer.appendChild(errorMessage);
  containerElem.appendChild(errorContainer);
}

function renderShows() {
  for (const eachShow of showsArray) {
    const eachShowContainer = document.createElement("div");
    eachShowContainer.classList.add("show--preview");
    eachShowContainer.setAttribute("data-id", eachShow.mal_id);
    renderTitle(eachShowContainer, eachShow);
    renderImage(eachShowContainer, eachShow, containerElem);
    eachShowContainer.addEventListener("click", handleShowClick);
    checkIfFavorite(eachShow);
  }
}

function renderResults() {
  containerElem.innerHTML = "";
  if (showsArray.length === 0) {
    renderErrorMessage();
  } else {
    renderShows();
  }
}

function getDataApi() {
  fetch(APIPath + searchValue)
    .then((response) => response.json())
    .then((data) => {
      showsArray = data.results;
      renderResults();
    });
}

function handleSearchButtonClick(event) {
  event.preventDefault();
  getSearchValue();
  if (searchValue === "") {
    containerElem.innerHTML = "Venga, busca algo.";
  } else if (searchValue.length < 3) {
    containerElem.innerHTML = "Introduce al menos 3 caracteres.";
  } else {
    getDataApi();
  }
}

function setAsFavorite(event) {
  const selectedShow = event.currentTarget;
  selectedShow.classList.toggle("favorite");
}

function setAsNotFavorite(showFavId) {
  // Por qué lo que devuelve el qsAll no permite hacer find
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

function removeFavFromArray(event) {
  const showFavId = parseInt(event.currentTarget.parentNode.dataset.id);
  const showFavIndex = favShowsArray.findIndex(
    (favShow) => favShow.mal_id === showFavId
  );
  favShowsArray.splice(showFavIndex, 1);
  setAsNotFavorite(showFavId);
}

function handleRemoveFavClick(event) {
  removeFavFromArray(event);
  saveToLS();
  renderFavList();
}

function renderRemoveFavIcon(container) {
  const removeFavIcon = document.createElement("div");
  // añadir clase con espacios icono de font awesome
  // const faIconClass = "far fa-times-circle"
  removeFavIcon.classList.add("fav--remove__icon");
  removeFavIcon.addEventListener("click", handleRemoveFavClick);
  container.appendChild(removeFavIcon);
}

function handleResetButtonFavClick() {
  favShowsArray = [];
  saveToLS();
  renderFavList();
  renderResults();
}

function renderResetButtonFav() {
  const resetButtonFav = document.createElement("input");
  resetButtonFav.setAttribute("type", "reset");
  resetButtonFav.setAttribute("value", "Limpiar favoritos");
  resetButtonFav.classList.add("main--buttonFav");
  resetButtonFav.addEventListener("click", handleResetButtonFavClick);
  favContainerElem.appendChild(resetButtonFav);
}

function renderFavList() {
  favContainerElem.innerHTML = "";
  if (favShowsArray.length !== 0) {
    renderResetButtonFav();
    for (const eachShow of favShowsArray) {
      const eachShowContainer = document.createElement("div");
      eachShowContainer.classList.add("show--preview__fav");
      eachShowContainer.setAttribute("data-id", eachShow.mal_id);
      renderTitle(eachShowContainer, eachShow);
      renderImage(eachShowContainer, eachShow, favContainerElem);
      renderRemoveFavIcon(eachShowContainer);
    }
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

function handleResetButtonClick() {
  showsArray = [];
  containerElem.innerHTML = "";
}

function getDataLS() {
  const favShowsArrayLS = JSON.parse(localStorage.getItem("favShowsArrayLS"));
  if (favShowsArrayLS !== null) {
    favShowsArray = favShowsArrayLS;
    renderFavList();
  }
}

getDataLS();

searchButton.addEventListener("click", handleSearchButtonClick);
resetButton.addEventListener("click", handleResetButtonClick);
