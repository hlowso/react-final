export default function(data) {
	this.vars = data.vars;
	this.vars.startTime = new Date();
	if (!this.vars.player_ids.length) {
		this.scene.start("Lobby", {
			vars: this.vars
		});
	} else if (this.vars.ws && (this.vars.ws.readyState === this.vars.ws.CLOSED || this.vars.ws.readyState === this.vars.ws.CLOSING)) {
		this.scene.start("Title", { vars: {message: "Connection closed."}  });
	}
	 else {
		this.vars.ws.send(
			JSON.stringify({
				device: "desktop",
				subject: "listen"
			})
		);
		this.vars.score = 0;
	}
}
