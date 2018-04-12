import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";
import NewGameButton from "./assets/new_game_button.png";

const asyncPostScore = (collection, score) => {
	console.log(score);

	return fetch(`/${collection}-scores`, {
		method: "POST",
		body: JSON.stringify(score),
		headers: {
			"content-type": "application/json"
		}
	}).then(response => response.json());
};

// EXAMPLE USAGE
// asyncPostScore("user", {
// 	username: "deadmau5",
// 	killCount: 512
// }).then(() => console.log("done"));

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
		console.log(data);
		this.vars = data.vars;
		this.entities = data.entities;
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

		let gameOverText = this.add.text(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 4,
			`GAME OVER!`,
			{ font: "128px Courier New", fill: "#000000" }
		);
		gameOverText.setOrigin(0.5);

		let teamScoreText = this.add.text(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 3,
			"Score: " + this.vars.score,
			{ font: "96px Courier New", fill: "#000000" }
		);
		teamScoreText.setOrigin(0.5);

		// console.log(this.entities.players.individuals);
		let step = 0;
		for (let playerId in this.entities.players.individuals) {
			let player = this.entities.players.individuals[playerId];
			let killcountText = this.add.text(
				gameAttributes.gameWidth / 2,
				gameAttributes.gameHeight / 2 + step * 75,
				player.name + " kills: " + player.killcount,
				{ font: "72px Courier New", fill: player.colour }
			);
			killcountText.setOrigin(0.5);
			step++;
		}

		// for (let i = 0; i < Object.keys(this.entities.players.individuals).length; i ++) {
		// 	let player = this.entities.players.individuals[i];
		// 	let killcountText = this.add.text(
		// 		gameAttributes.gameWidth / 2,
		// 		gameAttributes.gameHeight / 2 + i * 50,
		// 		player.name + ' kills: ' + player.killcount,
		// 		{ font: "72px Courier New", fill: player.colour });
		// 	killcountText.setOrigin(0.5);
		// }

		if (this.vars.player_ids.length) {
			const replay_button = this.add.image(
				gameAttributes.gameWidth / 2,
				gameAttributes.gameHeight - 100,
				"new-game-button"
			);

			replay_button.setInteractive();
			replay_button.on("clicked", clickHandler, this);
		}

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
