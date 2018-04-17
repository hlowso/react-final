import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";
import StartGameButton from "./assets/start_button.png";
import leaderboardButton from "./assets/leaderboard_button.png";

// Retrieve JSON from database with score information
const asyncGetScores = collection => {
	return fetch(`/${collection}-scores`).then(response => response.json());
};

// Create highscore tables from the retrieved JSON
const fillScoresTable = (tableId, name, fields, scores) => {
	const table = document.getElementById(tableId);
	table.innerHTML = "";
	const caption = table.createCaption();
	caption.innerHTML = `<b>${name}</b>`;
	const header = table.createTHead();
	const headRow = header.insertRow(0);
	const body = table.createTBody();

	let i, j;
	for (i = 0; i < fields.length; i++) {
		headRow.insertCell(i).innerHTML = `<b>${fields[i]}</b>`;
	}

	for (i = 0; i < scores.length; i++) {
		const row = body.insertRow(i);
		const keys = Object.keys(scores[i]);
		for (j = 1; j < keys.length; j++) {
			row.insertCell(j - 1).innerHTML = scores[i][keys[j]];
		}
	}
};

function displayLeaderboards(button) {
	const modal = document.getElementById("leaderboard-modal");

	// Call the functions to retrieve the highscores and then fill out the tables
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

	// Close the modal
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
}

// Click handler for the start button to go to the lobby scene
function startClickHandler(button) {
	button.off("clicked", startClickHandler);
	button.input.enabled = false;
	this.scene.start("Lobby", {
		vars: this.vars
	});
}

// Phaser Scene Class for the title screen
const titleScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "Title" });
	},

	// Image assets
	preload: function() {
		this.load.image("background", SkyBackground);
		this.load.image("start_button", StartGameButton);
		this.load.image("leaderboard_button", leaderboardButton);
	},

	init: function(data) {
		this.vars = data.vars;
	},

	create: function() {
		const background = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"background"
		);

		background.setScale(window.devicePixelRatio * 2);

		// Button for going to the lobby
		const start_button = this.add.image(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 4,
			"start_button"
		);
		start_button.setInteractive();
		start_button.on("clicked", startClickHandler, this);

		// Button to load the leaderboards
		const leaderboard_button = this.add.image(
			gameAttributes.gameWidth / 5,
			gameAttributes.gameHeight / 2,
			"leaderboard_button"
		);
		leaderboard_button.setInteractive();
		leaderboard_button.on("clicked", displayLeaderboards, this);

		// Error message that displays on home screen if the websocket connection is closed on the phone side
		if (this.vars && this.vars.message) {
			this.add.text(
				gameAttributes.gameWidth / 2,
				gameAttributes.gameHeight / 2,
				"Connection closed, please go back to lobby.",
				{ font: "48px Arial" }
				);
		}

		// Makes buttons work in Phaser
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
