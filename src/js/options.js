import "../css/options.css";
import jikanjs from "jikanjs";

const listModal = document.getElementById("list");
const listContainer = document.getElementById("anime-container");
const selectionContainer = document.getElementById("select-new-anime");
const searchbar = document.querySelector(".list-searchbar");
const searchIcon = document.querySelector(".search-icon");
const deleteButton = document.getElementById("delete-button");

deleteButton.addEventListener("click", () => {
	chrome.storage.sync.get(["listObject"], (result) => {
		const listObject = result.listObject;
		let aniList = listObject.anime;
		const checked = getChecked();
		checked.forEach((id) => {
			const foundAnime = aniList.find((anime) => {
				return anime.mal_id === parseInt(id);
			});
			aniList.splice(aniList.indexOf(foundAnime), 1);
		});
		listObject.anime = aniList;
		chrome.storage.sync.set({ listObject }, () => {
			chrome.tabs.query(
				{
					active: true,
					currentWindow: true
				},
				(tabs) => {
					chrome.tabs.reload(tabs[0].id);
				}
			);
		});
	});
});

searchbar.addEventListener("focus", () => {
	searchIcon.style.opacity = 0;
});

searchbar.addEventListener("focusout", () => {
	searchIcon.style.opacity = 1;
});

searchbar.addEventListener("keyup", (e) => {
	console.log(renderSearch(e.target.value));
});

let animeList = {};

function getChecked() {
	const checkBoxes = document.querySelectorAll("#checkbox");
	let checked = [];
	for (let checkbox of checkBoxes) {
		if (checkbox.checked) {
			checked.push(checkbox.value);
		}
	}
	return checked;
}

function renderSearch(searchTerm) {
	listContainer.innerHTML = "";
	const filteredAnime = animeList.filter((anime) =>
		anime.title.toLowerCase().includes(searchTerm.toLowerCase())
	);
	filteredAnime.forEach((anime) => {
		renderAnimeList(anime);
	});
}

chrome.storage.sync.get(["selection"], (result) => {
	console.log(result.selection);
	if (result.selection) {
		listModal.style.display = "none";
		selectionContainer.style.display = "block";
		chrome.storage.local.get(["selected"], (result) => {
			result.selected.searchResults.forEach((anime) => {
				renderAnimeSelection(
					anime,
					result.selected.currentEpisode,
					result.selected.urlTitle,
					result.selected.watchUrl
				);
			});
			chrome.storage.sync.set({ selection: false });
			chrome.storage.local.set({ selected: [] });
		});
	} else {
		chrome.storage.sync.get(["listObject"], (result) => {
			console.log(result.listObject);
			animeList = result.listObject.anime.reverse();
			animeList.forEach((anime) => {
				console.log(animeList);
				renderAnimeList(anime);
			});
		});
	}
});

function renderAnimeSelection(
	{ mal_id, url, image_url, title, episodes },
	episodeCount,
	urlTitle,
	watchUrl
) {
	const animeContainer = document.createElement("div");
	animeContainer.innerHTML = `
                    <div class="title">
                        <img
                            src="${image_url}"
                        />
                        <h2>${title}</h2>
                    </div>
                    <div class="episode-count">
                        <span id="total-episodes">${
							episodes === 0 ? "Unknown" : episodes
						}</span>
                    </div>
                    <div class="link-to-mal">
                        <a
                            target="_blank"
                            href="${url}"
                            >MyAnimeList</a
                        >
                    </div>
                    <div class="select-button">
                        <button id="${mal_id}">Select</button>
                    </div>
    `;

	animeContainer
		.querySelector(".select-button")
		.addEventListener("click", () => {
			addAnime(
				{ mal_id, url, image_url, title, episodes },
				episodeCount,
				urlTitle,
				watchUrl
			);
			chrome.tabs.getCurrent((tab) => {
				chrome.tabs.remove(tab.id);
			});
		});

	animeContainer.classList.add("anime-display", "select");
	selectionContainer.appendChild(animeContainer);
}

function addAnime(
	{ mal_id, url, image_url, title, episodes },
	episodeCount,
	urlTitle,
	watchUrl
) {
	chrome.storage.sync.get(["listObject"], (result) => {
		const aniList = result.listObject;
		// console.log(aniList);
		const condition = aniList.anime.find((obj, index) => {
			if (obj.mal_id === mal_id) {
				aniList.anime[index].episodeCount = episodeCount;
				aniList.anime[index].urlTitle.push(urlTitle);
				aniList.anime.push(aniList.anime.splice(index, 1)[0]);
			}
			return obj.mal_id === mal_id;
		});
		if (!condition) {
			aniList.anime.push({
				episodeCount,
				mal_id,
				image_url,
				url,
				title,
				watchUrl,
				episodeTotal: episodes,
				urlTitle: [urlTitle]
			});
			console.log(aniList);
		}
		chrome.storage.sync.set({ listObject: aniList });
	});
}

function renderAnimeList({
	mal_id,
	url,
	image_url,
	title,
	episodeTotal,
	episodeCount,
	watchUrl
}) {
	const animeContainer = document.createElement("div");
	let completionPercent = Math.ceil((episodeCount / episodeTotal) * 100);
	let status = "Watching";
	let color = "#11cdef";
	if (episodeCount === episodeTotal) {
		status = "Completed";
		color = "#2DCE98";
	} else if (
		episodeTotal === 0 ||
		(episodeTotal !== 0 && episodeCount > episodeTotal)
	) {
		completionPercent = "?";
		episodeTotal = "?";
	}

	animeContainer.innerHTML = `<label class="checkbox">
						<input type="checkbox" id="checkbox" value="${mal_id}" />
						<span class="checkmark"></span>
					</label>
                    <div class="title">
                    <img
                        src="${image_url}"
                    />
                    <a href="${watchUrl}" target="_blank"
                        <h2>${title}</h2>
                    </a>
					</div>
					<div class="episode-count">
						<span id="watched-episodes">${episodeCount}</span>
						/
						<span id="total-episodes">${episodeTotal}</span>
					</div>
					<div class="status">
						<span class="dot" style="background-color: ${color}"></span>
						<span class="status-text">${status}</span>
					</div>
					<div class="completion-progress">
						<span class="percent">${completionPercent}</span>%
						<div class="progress-bar-background">
							<div class="progress-bar-foreground" style="background-color: ${color}; width: ${
		completionPercent === "?" ? 0 : completionPercent
	}%"></div>
						</div>
                    </div>`;

	animeContainer.classList.add("anime-display");
	listContainer.appendChild(animeContainer);
}
