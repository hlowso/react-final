import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";

const titleScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "Title" });
	},
	preload: function() {
		this.load.image("background", SkyBackground);
	},
	create: function() {
		const background = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"background"
		);

		background.setScale(window.devicePixelRatio * 2);

		this.add.text(
			gameAttributes.width / 2,
			gameAttributes.height / 2,
			`WELCOME BITCHES!`
		);
		// console.log(JSON.stringify());

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
