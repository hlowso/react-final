import React from "react";
import ReactDOM from "react-dom";
import start from "./start-game.js";
import MobileApp from "./MobileApp.js";

// Check if the browser is mobile and display the mobile version if it is
const isMobile = () => {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);
};

if (isMobile()) {
	document.addEventListener("contextmenu", event => event.preventDefault());
	ReactDOM.render(
		<MobileApp />,

		document.getElementById("root")
	);
} else {
	// Start the phaser game if the browser is not mobile
	window.onload = start();
}
