export default function() {
	// Update the score for every loop of the update function
	this.vars.score += 1;
	this.vars.gameScoreText.setText("Score: " + this.vars.score);

	// Checks whether there are any players still connected. If there are, check whether any are still alive (player.alive)
	if (this.vars.player_ids.length) {
		let game_over = true;
		for (let player_id in this.entities.players.individuals) {
			let player = this.entities.players.individuals[player_id];

			// If a player is alive, then game_over is false and then checks whether that player is trying to shoot
			if (player.alive) {
				game_over = false;
				// If a phone is sending a shooting status message, then tell that associated sprite to shoot.
				if (player.shooting) {
					this.fireBullet(player);
				}
			}
		}
		// If game_over is true, tell the desktop to ignore messages from the phone and go to the end game scene
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
		// If there are no more connected players, then redirect to the lobby
		this.vars.ws.send(
			JSON.stringify({
				device: "desktop",
				subject: "ignore"
			})
		);
		this.scene.start("Lobby", { vars: this.vars });
	}
}
