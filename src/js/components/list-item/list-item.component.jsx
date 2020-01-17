import React from "react";

import "./list-item.styles.css";

import { Checkbox } from "../checkbox/checkbox.component";
import { ListTitle } from "./list-title.component";

export const ListItem = ({
	title,
	image_url,
	mal_id,
	checkboxHandler,
	mode
}) => {
	if (mode === "home") {
		return (
			<div className='list-item'>
				<Checkbox mal_id={mal_id} checkboxHandler={checkboxHandler} />
				<ListTitle title={title} image_url={image_url} />
			</div>
		);
	} else {
		return (
			<div className='list-item'>
				<ListTitle title={title} image_url={image_url} />
			</div>
		);
	}
};
