import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";

const endScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "End" });
	},

	init: function(data) {
		console.log(data);
		this.vars = data.vars;
		this.entities = data.entities;
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

		let gameOverText = this.add.text(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 4,
			`GAME OVER!`,
			{ font: "96px Courier New", fill: "#000000" }
		);
		gameOverText.setOrigin(0.5);

		let teamScoreText = this.add.text(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 3,
			'Score: ' + this.vars.score,
			{ font: "72px Courier New", fill: "#000000" }
		);
		teamScoreText.setOrigin(0.5);

		// console.log(this.entities.players.individuals);
		let step = 0;
		for (let playerId in this.entities.players.individuals) {
			let player = this.entities.players.individuals[playerId];
			let killcountText = this.add.text(
				gameAttributes.gameWidth / 2,
				gameAttributes.gameHeight / 2 + step * 50,
				player.name + ' kills: ' + player.killcount,
				{ font: "72px Courier New", fill: player.colour });
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
