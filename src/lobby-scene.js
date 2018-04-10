import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";
import NewGameButton from "./assets/new_game_button.png";

let start = false;

function clickHandler(button) {
	button.off("clicked", clickHandler);
	button.input.enabled = false;
	this.scene.start("Play", {
		ws: this.vars.ws,
		player_ids: this.vars.player_ids
	});
}

const lobbyScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "Lobby" });
	},

	preload: function() {
		this.load.image("background", SkyBackground);
		this.load.image("new-game-button", NewGameButton);
	},

	init: function() {
		this.vars = {
			player_ids: []
		};
	},

	create: function() {
		this.vars.ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
		this.vars.ws.onopen = () => {
			this.vars.ws.send(
				JSON.stringify({
					device: "desktop",
					code: gameAttributes.code
				})
			);
		};

		this.vars.ws.onmessage = incoming_message => {
			const message = JSON.parse(incoming_message.data);
			if (message.subject === "connect") {
				this.vars.player_ids = [message.player_id];
				console.log(this.vars.player_ids);
			}
		};

		const background = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"background"
		);

		background.setScale(window.devicePixelRatio * 2);

		const new_game_button = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 4,
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

		// THIS ISN'T WORKING! :(
		this.add.text(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"CODE PLACEHOLDER"
		);
	}

	// update: function() {
	// 	if (start) {
	// 		this.scene.start("Play", { player_ids: this.vars.player_ids });
	// 	} else {
	// 	}
	// }
});

export default lobbyScene;
