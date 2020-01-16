import React, { Component } from "react";
import { SearchBar } from "../search-bar/search-bar.component";
import { SortTitles } from "../sort-titles/sort-titles";
import "./modal.styles.css";

class Modal extends Component {
	constructor() {
		super();

		this.state = {
			renderList: [],
			mode: "list"
		};

		this.header =
			this.state.mode === "list"
				? {
						text: "Your List",
						style: { marginLeft: "5%", marginRight: "2%" }
				  }
				: {
						text:
							"Select the anime you're about to watch! (We only show this once for each anime)",
						style: { width: "100%", textAlign: "center" }
				  };
		this.titles = [
			{ text: "Title", buttons: false },
			{ text: "Episodes Watched", buttons: true },
			{ text: "Status", buttons: false },
			{ text: "Completion", buttons: true }
		];
	}

	render() {
		return (
			<div className='modal-container'>
				<h1 style={this.header.style}>{this.header.text}</h1>
				<SearchBar mode={this.state.mode} />
				<SortTitles mode={this.state.mode} titles={this.titles} />
			</div>
		);
	}
}

export default Modal;
