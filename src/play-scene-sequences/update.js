export default function() {
	if (this.entities.player.alive) {
		this.vars.score += 1;
		this.vars.playerScore.setText("score: " + this.vars.score);

		if (this.vars.score % 1000 === 0) {
			this.enemySpawn();
		}

		this.physics.collide(
			this.entities.enemies,
			this.entities.bullets,
			this.bulletEnemyCollision,
			null,
			this
		);

		if (this.vars.shooting) {
			this.fireBullet();
		}
	} else {
		// Go To Gameover sequence
	}
}
