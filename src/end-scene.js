import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";
import NewGameButton from "./assets/new_game_button.png";
import MenuButton from "./assets/menu_button.png";

const asyncPostScore = (collection, score) => {
	return fetch(`/${collection}-scores`, {
		method: "POST",
		body: JSON.stringify(score),
		headers: {
			"content-type": "application/json"
		}
	}).then(response => response.json());
};

const endScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "End" });
	},

	preload: function() {
		this.load.image("background", SkyBackground);
		this.load.image("new-game-button", NewGameButton);
		this.load.image("menu-button", MenuButton);
	},

	init: function(data) {
		this.vars = data.vars;
		this.entities = data.entities;
	},

	create: function() {
		const clickHandler = button => {
			button.off("clicked", clickHandler);
			button.input.enabled = false;
			this.scene.start("Play", {
				// ws: this.vars.ws,
				// player_ids: this.vars.player_ids,
				// player_names: this.vars.player_names
				vars: this.vars
			});
		};

		const menuButtonHandler = button => {
			button.off("clicked", menuButtonHandler);
			button.input.enabled = false;
			this.scene.start("Title", {
				vars: this.vars
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

		let step = 0;
		let totalKills = 0;
		let teamname = "";
		for (let playerId in this.entities.players.individuals) {
			let player = this.entities.players.individuals[playerId];
			let killcountText = this.add.text(
				gameAttributes.gameWidth / 2,
				gameAttributes.gameHeight / 2 + step * 75,
				player.name + "'s kills: " + player.killcount,
				{ font: "72px Courier New", fill: player.colour }
			);
			killcountText.setOrigin(0.5);

			totalKills += player.killcount;
			teamname += teamname ? `, ${player.name}` : player.name;

			asyncPostScore("user", {
				username: player.name,
				killCount: player.killcount
			});

			step++;
		}

		asyncPostScore("team", {
			teamname,
			score: this.vars.score,
			totalKills
		});

		if (this.vars.player_ids.length) {
			const replay_button = this.add.image(
				gameAttributes.gameWidth / 3,
				gameAttributes.gameHeight - 100,
				"new-game-button"
			);

			const menu_button = this.add.image(
				2 * gameAttributes.gameWidth / 3,
				gameAttributes.gameHeight - 300,
				"menu-button"
			);

			replay_button.setInteractive();
			menu_button.setInteractive();
			replay_button.on("clicked", clickHandler, this);
			menu_button.on("clicked", menuButtonHandler, this);
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
