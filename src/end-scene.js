import gameAttributes from "./game-attributes.js";
// import SkyBackground from "./assets/sky.png";
import gameOverBackground from "./assets/game-over.png";
import NewGameButton from "./assets/new_game_button.png";
import MenuButton from "./assets/menu_button.png";
import ReviewButton from "./assets/review_button.png";

// Sends scores and killcounts to the database
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
		// this.load.image("background", SkyBackground);
		this.load.image("game-over", gameOverBackground);
		this.load.image("new-game-button", NewGameButton);
		this.load.image("menu-button", MenuButton);
		this.load.image("review-button", ReviewButton);
	},

	init: function(data) {
		this.vars = data.vars;
		this.entities = data.entities;
	},

	create: function() {
		// Event handler to start a new game
		const clickHandler = button => {
			button.off("clicked", clickHandler);
			button.input.enabled = false;
			this.scene.start("Play", {
				vars: this.vars
			});
		};

		// Event handler to go back to the main menu
		const menuButtonHandler = button => {
			button.off("clicked", menuButtonHandler);
			button.input.enabled = false;
			this.scene.start("Title", {
				vars: this.vars
			});
		};

		// Event handler to open the review submission handler
		const reviewButtonHandler = button => {
			const modal = document.getElementById("review-modal");
			const form = document.getElementById("review-form");
			function handleSubmission(event) {
				event.preventDefault();
				fetch("/reviews", {
					method: "POST",
					body: JSON.stringify({
						rating: event.target.rating.value,
						comment: event.target.comment.value
					}),
					headers: {
						"content-type": "application/json"
					}
				}).then(response => {
					event.target.comment.value = "";
					form.removeEventListener("submit", handleSubmission);
					modal.style.display = "none";
				});
			}

			form.addEventListener("submit", handleSubmission);
			modal.style.display = "block";

			window.onclick = function(event) {
				if (event.target == modal) {
					modal.style.display = "none";
				}
			};
		};

		const gameOverBackground = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"game-over"
		);
		gameOverBackground.setScale(window.devicePixelRatio * 2 + 1);

		// let gameOverText = this.add.text(
		// 	gameAttributes.gameWidth / 2,
		// 	gameAttributes.gameHeight / 4,
		// 	`GAME OVER!`,
		// 	{ font: "128px Rajdhani", fill: "#000000" }
		// );
		// gameOverText.setOrigin(0.5);

		let teamScoreText = this.add.text(
			gameAttributes.gameWidth / 2,
			2 * gameAttributes.gameHeight / 5,
			"Score: " + this.vars.score,
			{ font: "110px Rajdhani", fill: "#000000" }
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
				{ font: "72px Rajdhani", fill: player.colour }
			);
			killcountText.setOrigin(0.5);

			totalKills += player.killcount;
			teamname += teamname ? `, ${player.name}` : player.name;

			// Submits the player's killcount if it is at least 1
			if (player.killcount) {
				asyncPostScore("user", {
					username: player.name,
					killCount: player.killcount
				});
			}

			step++;
		}

		// Submits the team's score and total killcount if it is at least 1
		if (totalKills) {
			asyncPostScore("team", {
				teamname,
				score: this.vars.score,
				totalKills
			});
		}

		// If there are still players connected, display the new game button
		if (this.vars.player_ids.length) {
			const replay_button = this.add.image(
				gameAttributes.gameWidth / 2,
				gameAttributes.gameHeight - 500,
				"new-game-button"
			);

			replay_button.setInteractive();
			replay_button.on("clicked", clickHandler, this);
		}

		// Button to redirect to the main scene
		const menu_button = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight - 350,
			"menu-button"
		);

		menu_button.setInteractive();
		menu_button.on("clicked", menuButtonHandler, this);

		// Button for displaying the review modal
		const review_button = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight - 200,
			"review-button"
		);

		review_button.setInteractive();
		review_button.on("clicked", reviewButtonHandler, this);

		// Enables buttons in phaser
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
