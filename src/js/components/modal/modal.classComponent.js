import React, { Component } from "react";
import { SearchBar } from "../search-bar/search-bar.component";
import { SortTitles } from "../sort-titles/sort-titles";
import { ListItemsContainer } from "../list-items-container/list-items-container.components";
import { Button } from "../button/button.component";
import "./modal.styles.css";

class Modal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			renderList: props.listItems,
			mode: props.mode,
			selctedItems: [],
			searching: false
		};

		this.header = {
			text: "Your List",
			style: { marginLeft: "5%", marginRight: "2%" }
		};

		this.titles = [
			{ text: "Title", buttons: false },
			{ text: "Episodes Watched", buttons: true },
			{ text: "Status", buttons: false },
			{ text: "Completion", buttons: true }
		];
	}

	filterList = (e) => {
		const term = e.target.value;
		const filteredList = this.props.listItems.filter((item) =>
			item.title.toLowerCase().includes(term.toLowerCase())
		);
		if (!this.state.searching) {
			this.setState({ searching: true });
		}
		this.setState({ renderList: filteredList });
	};

	addSelected = (e) => {
		let selectedItems = [...this.state.selctedItems];
		if (e.target.checked) {
			selectedItems.push(e.target);
		} else {
			selectedItems.splice(selectedItems.indexOf(e.target), 1);
		}
		this.setState({ selctedItems: selectedItems });
	};

	deleteSelected = () => {};

	componentDidUpdate() {
		if (
			this.props.listItems !== this.state.renderList &&
			!this.state.searching
		) {
			this.setList(this.props.listItems);
		} else if (this.props.mode !== this.state.mode) {
			this.titles = [
				{ text: "Title" },
				{ text: "Total Episodes" },
				{ text: "Link to MAL" }
			];

			this.header = {
				text:
					"Select the anime you're about to watch! (We only show this once for each anime)",
				style: { width: "100%", textAlign: "center" }
			};

			this.setState({ mode: this.props.mode });
		}
	}

	setList(renderList) {
		this.setState({ renderList });
	}

	render() {
		switch (this.state.mode) {
			case "home":
				console.log();
				return (
					<div className='modal-container'>
						<h1 style={this.header.style}>{this.header.text}</h1>
						<SearchBar
							mode={this.state.mode}
							onChangeHandler={this.filterList}
						/>
						<Button text='Edit' color='#7764e4' outline={true} />
						<Button text='Delete' color='#cc3f29' outline={false} />
						<SortTitles
							mode={this.state.mode}
							titles={this.titles}
						/>
						<ListItemsContainer
							listItems={this.state.renderList}
							checkboxHandler={this.addSelected}
							mode={this.state.mode}
						/>
					</div>
				);
			case "selection":
				return (
					<div className='modal-container'>
						<h1 style={this.header.style}>{this.header.text}</h1>
						<SearchBar
							mode={this.state.mode}
							onChangeHandler={this.filterList}
						/>
						<SortTitles
							mode={this.state.mode}
							titles={this.titles}
						/>
						<ListItemsContainer
							mode={this.state.mode}
							listItems={this.state.renderList}
							checkboxHandler={this.addSelected}
							selectHandler={this.props.selectHandler}
						/>
					</div>
				);
			default:
				return <div></div>;
		}
	}
}

export default Modal;
