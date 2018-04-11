export default function() {
	this.vars.score += 1;
	this.vars.playerScore.setText("score: " + this.vars.score);

	// if (this.vars.score % 300 === 0) {
	// 	this.enemySpawn();
	// }

	this.physics.collide(
		this.entities.enemies,
		this.entities.bullets,
		this.bulletEnemyCollision,
		null,
		this
	);

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
		console.log("GAME_OVER!");
	}
}
