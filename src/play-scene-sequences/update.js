export default function() {
	this.vars.score += 1;
	this.vars.gameScoreText.setText("Score: " + this.vars.score);

	if (this.vars.player_ids.length) {
		let game_over = true;
		for (let player_id in this.entities.players.individuals) {
			let player = this.entities.players.individuals[player_id];

			if (player.alive) {
				game_over = false;
				if (player.shooting) {
					this.fireBullet(player);
				}
			}
		}
		if (game_over) {
			this.vars.ws.send(
				JSON.stringify({
					device: "desktop",
					subject: "ignore"
				})
			);
			this.scene.start("End", { vars: this.vars, entities: this.entities });
		}
	} else {
		this.vars.ws.send(
			JSON.stringify({
				device: "desktop",
				subject: "ignore"
			})
		);
		this.scene.start("Lobby", { vars: this.vars });
	}
}
