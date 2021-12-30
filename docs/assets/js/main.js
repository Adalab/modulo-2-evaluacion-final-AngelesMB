"use strict";const searchElem=document.querySelector(".js-search"),containerElem=document.querySelector(".js-container"),favContainerElem=document.querySelector(".js-favContainer"),searchButton=document.querySelector(".js-searchButton"),resetButton=document.querySelector(".js-resetButton"),APIPath="https://api.jikan.moe/v3/search/anime?q=";let showsArray=[],favShowsArray=[],searchValue="";function getSearchValue(){searchValue=searchElem.value.toLowerCase()}function renderTitle(e,t){const a=document.createElement("h4"),r=document.createTextNode(t.title);a.classList.add("title--preview"),a.appendChild(r),e.appendChild(a)}function renderImage(e,t,a){const r=document.createElement("div");r.classList.add("image--preview"),e.appendChild(r),r.setAttribute("style",`background-image:url(${t.image_url})`),renderSynopsis(e,t,r,a)}function renderSynopsis(e,t,a,r){const n=document.createElement("p"),o=document.createTextNode(t.synopsis);n.classList.add("synopsis--preview","hidden"),n.appendChild(o),a.appendChild(n),r.appendChild(e)}function renderShows(){containerElem.innerHTML="";for(const e of showsArray){const t=document.createElement("div");t.classList.add("show--preview"),t.setAttribute("data-id",e.mal_id),renderTitle(t,e),renderImage(t,e,containerElem),t.addEventListener("click",handleShowClick)}}function getDataApi(){fetch(APIPath+searchValue).then(e=>e.json()).then(e=>{showsArray=e.results,renderShows()})}function handleSearchButtonClick(e){e.preventDefault(),getSearchValue(),getDataApi()}function setAsFavorite(e){e.currentTarget.classList.toggle("favorite")}function setAsNotFavorite(e){if(0!==showsArray.length){const t=document.querySelectorAll(".favorite"),a=Array.from(t).find(t=>parseInt(t.dataset.id)===e);void 0!==a&&a.classList.remove("favorite")}}function removeFavFromArray(e){const t=parseInt(e.currentTarget.parentNode.dataset.id),a=favShowsArray.findIndex(e=>e.mal_id===t);favShowsArray.splice(a,1),setAsNotFavorite(t)}function handleRemoveFavClick(e){removeFavFromArray(e),saveToLS(),renderFavList()}function renderRemoveFavIcon(e){const t=document.createElement("div");t.classList.add("remove--fav--icon"),t.addEventListener("click",handleRemoveFavClick),e.appendChild(t)}function renderFavList(){favContainerElem.innerHTML="";for(const e of favShowsArray){const t=document.createElement("div");t.classList.add("fav--show--preview"),t.setAttribute("data-id",e.mal_id),renderTitle(t,e),renderImage(t,e,favContainerElem),renderRemoveFavIcon(t)}}function saveToLS(){localStorage.setItem("favShowsArrayLS",JSON.stringify(favShowsArray))}function saveAsFavorite(e){const t=parseInt(e.currentTarget.dataset.id),a=showsArray.find(e=>e.mal_id===t),r=favShowsArray.findIndex(e=>e.mal_id===t);e.currentTarget.classList.contains("favorite")?favShowsArray.push(a):favShowsArray.splice(r,1),saveToLS()}function handleShowClick(e){setAsFavorite(e),saveAsFavorite(e),renderFavList()}function handleResetButtonClick(e){console.log("Has clickado en reset")}function getDataLS(){const e=JSON.parse(localStorage.getItem("favShowsArrayLS"));null!==e&&(favShowsArray=e,renderFavList())}getDataLS(),searchButton.addEventListener("click",handleSearchButtonClick),resetButton.addEventListener("click",handleResetButtonClick);