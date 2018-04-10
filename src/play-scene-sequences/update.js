export default function() {
	if (this.entities.players.length > 0) {
		this.vars.score += 1;
		this.vars.playerScore.setText("score: " + this.vars.score);

		if (this.vars.y_velocity > 0) {
			this.entities.player.rotation = Math.atan(
				this.vars.x_velocity / this.vars.y_velocity
			);
		} else if (this.vars.y_velocity === 0.0) {
			if (this.vars.x_velocity < 0) {
				this.entities.player.rotation = 0.5 * Math.PI;
			} else {
				this.entities.player.rotation = 1.5 * Math.PI;
			}
		} else {
			this.entities.player.rotation =
				Math.atan(this.vars.x_velocity / this.vars.y_velocity) + Math.PI;
		}

		this.entities.player.setVelocityX(8000.0 * this.vars.x_velocity);
		this.entities.player.setVelocityY(-8000.0 * this.vars.y_velocity);

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
