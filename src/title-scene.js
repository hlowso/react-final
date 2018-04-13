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

const fillScoresTable = (tableId, name, fields, scores) => {
	const table = document.getElementById(tableId);
	table.innerHTML = "";
	const caption = table.createCaption();
	caption.innerHTML = `<b>${name}</b>`;
	const header = table.createTHead();
	const headRow = header.insertRow(0);

	let i, j;
	for (i = 0; i < fields.length; i++) {
		headRow.insertCell(i).innerHTML = `<b>${fields[i]}</b>`;
	}

	for (i = 1; i <= scores.length; i++) {
		const row = table.insertRow(i);
		const keys = Object.keys(scores[i - 1]);
		for (j = 1; j < keys.length; j++) {
			row.insertCell(j - 1).innerHTML = scores[i - 1][keys[j]];
		}
	}
};

function displayLeaderboards(button) {
	const modal = document.getElementById("myModal");
	const exit = document.getElementById("close-modal");
	exit.onclick = function() {
		modal.style.display = "none";
	};

	asyncGetScores("user")
		.then(scores => {
			return fillScoresTable(
				"user-scores-table",
				"Kill Counts",
				["username", "kills"],
				scores
			);
		})
		.then(() => {
			return asyncGetScores("team");
		})
		.then(scores => {
			return fillScoresTable(
				"team-scores-table",
				"High Scores",
				["teamname", "score", "total kills"],
				scores
			);
		})
		.then(() => {
			modal.style.display = "block";
		});

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
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
		leaderboard_button.on("clicked", displayLeaderboards, this);

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
