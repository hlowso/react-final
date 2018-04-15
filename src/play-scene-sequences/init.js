export default function(data) {
	this.vars = data.vars;
	this.vars.startTime = new Date();
	if (!this.vars.player_ids.length) {
		this.scene.start("Lobby", {
			vars: this.vars
		});
	} else {
		this.vars.ws.send(
			JSON.stringify({
				device: "desktop",
				subject: "listen"
			})
		);
		this.vars.score = 0;
	}
}
