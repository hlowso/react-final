import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";

const endScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "End" });
	},

	preload: function() {
		this.load.image("background", SkyBackground);
	},

	init: function(data) {
		console.log(data);
	},

	create: function() {
		const background = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"background"
		);

		background.setScale(window.devicePixelRatio * 2);

		this.add.text(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			`GAME OVER!`,
			{ font: "96px Courier New", fill: "#000000" }
		);

		this.input.on(
			"gameobjectup",
			function(pointer, gameObject) {
				gameObject.emit("clicked", gameObject);
			},
			this
		);
	}
});

export default endScene;
