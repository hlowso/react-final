import gameAttributes from "../game-attributes.js";

export default function() {
	const clickHandler = button => {
		if (this.vars.player_ids.length) {
			button.off("clicked", clickHandler);
			button.input.enabled = false;
			this.scene.start("Play", {
				ws: this.vars.ws,
				player_ids: this.vars.player_ids,
				player_names: this.vars.player_names
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
		let index;
		const message = JSON.parse(incoming_message.data);
		// console.log("message to desktop: ", message);
		switch (message.subject) {
			case "connect":
				instruction.setVisible(false);
				this.vars.player_ids.push(message.player_id);
				this.vars.player_names[message.player_id] = message.username;

				let i = 0;
				for (let pid of this.vars.player_ids) {
					player_statuses[i].setText(
						`${
							this.vars.player_names[this.vars.player_ids[i]]
						}: not yet calibrated`
					);
					player_statuses[i++].setVisible(true);
				}
				// console.log(this.vars.player_ids);
				break;
			case "disconnect":
				index = this.vars.player_ids.indexOf(message.player_id);
				player_statuses[index].setVisible(false);
				break;
			case "calibrated":
				if (!ready) {
					ready = true;
					armButton(new_game_button);
				}
				let name = this.vars.player_names[message.player_id];
				index = this.vars.player_ids.indexOf(message.player_id);
				player_statuses[index].setText(`${name}: calibrated`);
				break;
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

	const player_statuses = [];
	for (let i = 1; i <= 3; i++) {
		let status = this.add.text(100, 200 + 100 * i, ``, {
			font: "96px Courier New",
			fill: "#000000"
		});
		player_statuses.push(status);
		status.setVisible(false);
	}

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
}
