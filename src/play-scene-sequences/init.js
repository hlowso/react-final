import NoSleep from "nosleep.js";

export default function(data) {
	this.vars = data.vars;

	// Setting the game time to the current time
	this.vars.startTime = new Date();

	// Setting the no sleep object
	this.vars.insomnia = new NoSleep();

	// If connected players array is empty, redirect back to the lobby
	if (!this.vars.player_ids.length) {
		this.scene.start("Lobby", {
			vars: this.vars
		});
		// If desktop websocket closes, redirect to the title scene
	} else if (
		this.vars.ws &&
		(this.vars.ws.readyState === this.vars.ws.CLOSED ||
			this.vars.ws.readyState === this.vars.ws.CLOSING)
	) {
		this.scene.start("Title", { vars: { message: "Connection closed." } });
	} else {
		// Start listening to mobile app for game commands
		this.vars.ws.send(
			JSON.stringify({
				device: "desktop",
				subject: "listen"
			})
		);
		this.vars.score = 0;
	}
}
