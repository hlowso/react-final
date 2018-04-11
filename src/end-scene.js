import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";
import NewGameButton from "./assets/new_game_button.png";

const endScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "End" });
	},

	preload: function() {
		this.load.image("background", SkyBackground);
		this.load.image("new-game-button", NewGameButton);
	},

	init: function(data) {
		this.vars = data.vars;
	},

	create: function() {
		const clickHandler = button => {
			button.off("clicked", clickHandler);
			button.input.enabled = false;
			this.scene.start("Play", {
				ws: this.vars.ws,
				player_ids: this.vars.player_ids
			});
		};

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

		const new_game_button = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight - 100,
			"new-game-button"
		);

		new_game_button.setInteractive();
		new_game_button.on("clicked", clickHandler, this);

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
