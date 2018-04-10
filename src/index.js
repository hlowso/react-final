import React from "react";
import ReactDOM from "react-dom";
import start from "./startGame.js";
import MobileApp from "./MobileApp.js";

const isMobile = () => {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	);
};

if (isMobile()) {
	ReactDOM.render(<MobileApp />, document.getElementById("root"));
} else {
	window.onload = start();
}
