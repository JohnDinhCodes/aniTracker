import React from "react";

import "./list-item.styles.css";

import { Checkbox } from "../checkbox/checkbox.component";
import { ListTitle } from "./list-title.component";
import { Button } from "../button/button.component";
import { StatusDot } from "../status-dot/status-dot.components";
import { ProgressBar } from "../progress-bar/progress-bar.component";

const round = (value, precision) => {
	const multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
};

const calculateStatus = (episodeCount, episodeTotal) => {
	console.log(typeof episodeCount, typeof episodeTotal);
	if (episodeTotal === 0) {
		return {
			status: "Watching",
			completion: "?%",
			progressBarWidth: "0%",
			progressColor: "#11cdef"
		};
	} else if (parseInt(episodeCount) === episodeTotal) {
		return {
			status: "Completed",
			completion: "100%",
			progressBarWidth: "100%",
			progressColor: "#2DCE98"
		};
	} else {
		return {
			status: "Watching",
			progressBarWidth: `${round(
				(episodeCount / episodeTotal) * 100,
				1
			)}%`,
			progressColor: "#11cdef"
		};
	}
};

const checkBox = (selectedItems, mal_id) =>
	selectedItems.indexOf(mal_id) >= 0 ? true : false;

export const ListItem = ({
	title,
	image_url,
	mal_id,
	checkboxHandler,
	totalEpisodes,
	url,
	selectHandler,
	episodeCount,
	episodeTotal,
	watchUrl,
	selectedItems,
	editState,
	editNumberHandler,
	mode
}) => {
	switch (mode) {
		case "home":
			const statusData = calculateStatus(episodeCount, episodeTotal);
			return (
				<div className='list-item'>
					<Checkbox
						mal_id={mal_id}
						checkboxHandler={checkboxHandler}
						shouldCheck={checkBox(selectedItems, mal_id)}
					/>
					<ListTitle
						title={title}
						image_url={image_url}
						watchUrl={watchUrl}
						style={{ marginLeft: "4em" }}
					/>
					<div>
						{editState === true && (
							<input
								className='edit-box'
								mal_id={mal_id}
								type='number'
								min='1'
								value={episodeCount}
								max={episodeTotal === 0 ? null : episodeTotal}
								onChange={editNumberHandler}
							/>
						)}
						{editState === false && <span>{episodeCount}</span>}/
						{episodeTotal === 0 ? "?" : episodeTotal}
					</div>
					<div>
						<StatusDot color={statusData.progressColor} />
						<span>{statusData.status}</span>
					</div>
					<ProgressBar
						color={statusData.progressColor}
						text={statusData.progressBarWidth}
						width={statusData.progressBarWidth}
					/>
				</div>
			);
		case "selection":
			return (
				<div className='list-item-selection'>
					<ListTitle title={title} image_url={image_url} />
					<div>{totalEpisodes === 0 ? "Unkown" : totalEpisodes}</div>
					<div>
						<a className='mal-link' href={url}>
							MyAnimeList
						</a>
					</div>
					<div>
						<Button
							color='#11cdef'
							text='Select'
							handler={selectHandler}
							mal_id={mal_id}
						/>
					</div>
				</div>
			);
		default:
			return <div></div>;
	}
};
