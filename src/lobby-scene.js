import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";

const mobileSockets = ["message"];
let start = false;

const lobbyScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "Lobby" });
	},
	preload: function() {
		this.load.image("background", SkyBackground);
	},
	create: function(data) {
		const ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					device: "desktop",
					code: gameAttributes.code
				})
			);
		};

		const background = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"background"
		);
		setTimeout(() => {
			start = true;
		}, 1000);
	},
	update: function() {
		if (start) {
			this.scene.start("Play", { mobileSockets: "mobilesocketsdata" });
		}
	}
});

export default lobbyScene;
