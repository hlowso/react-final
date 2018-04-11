export default function() {
	this.vars.score += 1;
	this.vars.gameScoreText.setText("score: " + this.vars.score);

	let game_over = true;
	for (let player_id in this.entities.players.individuals) {
		let player = this.entities.players.individuals[player_id];
		if (player.alive) {
			game_over = false;
			if (player.shooting) {
				this.fireBullet(player);
				console.log(player.killcount);
			}
		}
	}
	if (game_over) {
		this.scene.start("End", { vars: this.vars, entities: this.entities });
	}
}
