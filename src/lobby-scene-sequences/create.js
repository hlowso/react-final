import gameAttributes from "../game-attributes.js";

const PLAYER_COLOURS = ["white", "red", "yellow"];

export default function() {
	const clickHandler = button => {
		if (this.vars.player_ids.length) {
			button.off("clicked", clickHandler);
			button.input.enabled = false;
			this.scene.start("Play", {
				vars: this.vars
			});
		}
	};

	const armButton = button => {
		button.setInteractive();
		button.on("clicked", clickHandler, this);
		button.setVisible(true);
	};

	const disarmButton = button => {
		button.off("clicked", clickHandler, this);
		button.setVisible(false);
	};

	let ready = false;
	const playerStatusTextObjects = {};

	const printStatuses = () => {
		let i = 0;
		for (let id of this.vars.player_ids) {
			let obj = playerStatusTextObjects[id];

			if (obj && Object.keys(obj).length) {
				obj.setVisible(false);
				obj.destroy();
				delete playerStatusTextObjects[id];
			}

			if (this.vars.playerStatuses[id]) {
				if (!this.vars.player_colours[id]) {
					this.vars.player_colours[id] = PLAYER_COLOURS[i];
				}
				playerStatusTextObjects[id] = this.add.text(
					100,
					200 + 100 * i++,
					this.vars.playerStatuses[id],
					{
						font: "96px Courier New",
						fill: `${this.vars.player_colours[id]}`
					}
				);
			} else {
				let index = this.vars.player_ids.indexOf(id);
				this.vars.player_ids.splice(index, 1);
			}
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
		gameAttributes.gameHeight - 100,
		"new-game-button"
	);

	new_game_button.setVisible(false);

	const instruction = this.add.text(
		200,
		gameAttributes.gameHeight / 2,
		"Go to the site on your iPhone and enter the game code to join. \nUp to three players may join one local game.",
		{ font: "48px Courier New", fill: "#000000" }
	);

	const game_code = this.add.text(
		100,
		100,
		`GAME CODE: ${gameAttributes.code}`,
		{
			font: "96px Courier New",
			fill: "#000000"
		}
	);

	this.input.on(
		"gameobjectup",
		function(pointer, gameObject) {
			gameObject.emit("clicked", gameObject);
		},
		this
	);

	if (!this.vars.ws) {
		this.vars.playerStatuses = {};

		this.vars.ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
		this.vars.ws.onopen = () => {
			this.vars.ws.send(
				JSON.stringify({
					device: "desktop",
					subject: "connect",
					code: gameAttributes.code
				})
			);
		};

		this.vars.ws.onmessage = incoming_message => {
			let index;
			const message = JSON.parse(incoming_message.data);
			switch (message.subject) {
				case "connect":
					this.vars.player_ids.push(message.player_id);
					this.vars.player_names[message.player_id] = message.username;

					this.vars.playerStatuses[message.player_id] = `${
						this.vars.player_names[message.player_id]
					}: not yet calibrated`;

					printStatuses();
					break;

				case "disconnect":
					delete this.vars.playerStatuses[message.player_id];
					printStatuses();
					break;
				case "calibrated":
					if (!ready) {
						ready = true;
						armButton(new_game_button);
					}
					let name = this.vars.player_names[message.player_id];
					this.vars.playerStatuses[message.player_id] = `${name}: calibrated`;
					printStatuses();
					break;
			}
		};
	} else {
		if (this.vars.player_ids.length) {
			armButton(new_game_button);
		}
	}

	printStatuses();
}
