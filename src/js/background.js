import "../img/weeb_track32.png";
import jikanjs from "jikanjs";

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set(
		{
			listObject: { anime: [], manga: [] },
			tracking: true,
			selection: false
		},
		() => {
			console.log("Extension storage has been set up");
		}
	);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	chrome.tabs.getSelected(null, (tab) => {
		chrome.storage.sync.get(["tracking"], (result) => {
			const isCompatible = tab.url.toLowerCase().includes("episode");
			if (
				isCompatible &&
				changeInfo.status === "complete" &&
				result.tracking
			) {
				const url = tab.url.toLowerCase();
				const episodeNumberUrl = url.match(/episode\D+\d+/g);
				const episodeNumber = parseInt(
					episodeNumberUrl[0].match(/\d+/g)
				);
				const baseUrlLength = url.match(/\w+:\/\/[\w+.]+\//g)[0].length;
				let titleName = url.slice(
					baseUrlLength,
					url.indexOf(episodeNumberUrl) - 1
				);
				titleName = titleName
					.replace(/-/g, " ")
					.split(" ")
					.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
					.join(" ");

				jikanjs.search("anime", titleName).then((response) => {
					chrome.storage.sync.get(["listObject"], (result) => {
						// const animeId = response.results[0].mal_id;
						const weebList = result.listObject;

						const condition = weebList.anime.find((obj, index) => {
							const isIndex = obj.urlTitle.indexOf(titleName);
							if (isIndex >= 0) {
								weebList.anime[
									index
								].episodeCount = episodeNumber;
								weebList.anime.push(
									weebList.anime.splice(index, 1)[0]
								);
								return true;
							}
							// if (obj.mal_id === animeId) {
							// 	weebList.anime[
							// 		index
							// 	].episodeCount = episodeNumber;
							// 	weebList.anime.push(
							// 		weebList.anime.splice(index, 1)[0]
							// 	);
							// }
							// return obj.mal_id === animeId;
						});
						console.log(condition);
						if (!condition) {
							chrome.storage.sync.set({ selection: true }, () => {
								chrome.storage.local.set(
									{
										selected: {
											currentEpisode: episodeNumber,
											searchResults: response.results,
											urlTitle: titleName
										}
									},
									() => {
										chrome.runtime.openOptionsPage(() => {
											chrome.tabs.query(
												{
													active: true,
													currentWindow: true
												},
												(tabs) => {
													chrome.tabs.reload(
														tabs[0].id
													);
												}
											);
										});
									}
								);
							});
						} else {
							chrome.storage.sync.set(
								{
									listObject: weebList
								},
								() => {
									console.log("Anime list has been updated");
								}
							);
						}
					});
				});
			}
		});
	});
});
// this is code that runs everytime a page is updated
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if (changeInfo.status === "complete") {
//         console.log(tab);
//     }
// });
