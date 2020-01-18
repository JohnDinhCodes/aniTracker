import React, { Component } from "react";

import { SideMenu } from "../components/side-menu/side-menu.component";
import ChromeStorage from "../modules/ChromeStorage";
import "./App.css";

import homeIcon from "../../img/icons/home.svg";
import copyIcon from "../../img/icons/copy.svg";
import heartIcon from "../../img/icons/heart.svg";
import settingsIcon from "../../img/icons/settings.svg";

import Modal from "../components/modal/modal.classComponent";

class App extends Component {
	constructor() {
		super();

		this.storage = new ChromeStorage();

		this.state = {
			currentView: "home",
			listItems: [],
			selected: {},
			savedList: []
		};

		this.links = [
			{
				icon: homeIcon,
				iconAlt: "Home Icon",
				text: "Home",
				className: "home-icon",
				key: "home"
			},
			{
				icon: copyIcon,
				iconAlt: "Copy Icon",
				text: "Sync With MyAnimeList",
				className: "copy-icon",
				key: "sync"
			},
			{
				icon: heartIcon,
				iconAlt: "Heart Icon",
				text: "Support",
				className: "heart-icon",
				key: "support"
			},
			{
				icon: settingsIcon,
				iconAlt: "Settings Icon",
				text: "Settings",
				className: "settings-icon",
				key: "settings"
			}
		];
	}

	componentDidMount() {
		this.storage.get("selection").then((selection) => {
			if (selection) {
				this.updateMode("selection");
				this.storage.getLocal("selected").then((selected) => {
					console.log(selected);
					this.setState({ listItems: selected.searchResults });
				});
			}
		});
	}
	handleLinkClick = (e) => {
		const currentView = e.target.getAttribute("view");
		this.setState({ currentView });
	};

	handleSelectButton = (e) => {
		console.log(e.target);
		this.storage.addAnime();
	};

	updateMode(mode) {
		this.setState({
			currentView: mode
		});
	}

	updateSelected(selected) {
		this.setState({ selected });
		this.forceUpdate();
	}

	render() {
		return (
			<div className='App'>
				<SideMenu
					links={this.links}
					currentView={this.state.currentView}
					handleLinkClick={this.handleLinkClick}
				/>
				<Modal
					mode={this.state.currentView}
					listItems={this.state.listItems}
					selectHandler={this.handleSelectButton}
				/>
			</div>
		);
	}
}

export default App;
