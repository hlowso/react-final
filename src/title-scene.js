import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";

const titleScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function(data) {
		Phaser.Scene.call(this, { key: "Title" });
	},
	preload: function() {
		this.load.image("background", SkyBackground);
	},
	create: function(data) {
		const background = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"background"
		);
		this.add.text(
			gameAttributes.width / 2,
			gameAttributes.height / 2,
			`WELCOME BITCHES! ${data}`
		);
		// console.log(JSON.stringify(data));

		// console.log(this);
		setTimeout(() => {
			this.scene.start("Lobby", {
				data: "THIS is arbitrary data..."
			});
		}, 1000);
	},
	update: function() {}
});

export default titleScene;
