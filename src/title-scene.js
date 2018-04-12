import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";
import StartGameButton from "./assets/start_button.png";
import leaderboardButton from "./assets/leaderboard_button.png";

const leaderboardDB = {
	username: "Lor3e",
	score: 2500
};

const asyncGetScores = collection => {
	return fetch(`/${collection}-scores`).then(response => response.json());
};

const asyncPostScore = (collection, score) => {
	return fetch(`/${collection}-scores`, {
		method: "POST",
		data: score,
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		}
	}).then(response => response.json());
};

function displayLeaderboard(button) {
	button.off("clicked", displayLeaderboard);
	button.input.enabled = false;
	this.add.text(
		gameAttributes.gameWidth / 6,
		gameAttributes.gameHeight / 6,
		`Username: ${leaderboardDB.username}
			 Score: ${leaderboardDB.score}`
	);
}

let start = false;

function startClickHandler(button) {
	button.off("clicked", startClickHandler);
	button.input.enabled = false;
	this.scene.start("Lobby");
}

const titleScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "Title" });
	},

	preload: function() {
		this.load.image("background", SkyBackground);
		this.load.image("start_button", StartGameButton);
		this.load.image("leaderboard_button", leaderboardButton);
	},

	create: function() {
		// asyncGetScores("user").then(data => console.log(data));
		asyncPostScore("user", {
			username: "deadmau5",
			killCount: 512
		}).then(() => console.log("done"));

		const background = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"background"
		);

		background.setScale(window.devicePixelRatio * 2);

		const start_button = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 4,
			"start_button"
		);

		const leaderboard_button = this.add.image(
			gameAttributes.gameWidth / 5,
			gameAttributes.gameHeight / 2,
			"leaderboard_button"
		);

		start_button.setInteractive();

		start_button.on("clicked", startClickHandler, this);

		this.add.text(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			`WELCOME BITCHES!`
		);

		leaderboard_button.setInteractive();
		leaderboard_button.on("clicked", displayLeaderboard, this);

		this.input.on(
			"gameobjectup",
			function(pointer, gameObject) {
				gameObject.emit("clicked", gameObject);
			},
			this
		);
	}
});

export default titleScene;
