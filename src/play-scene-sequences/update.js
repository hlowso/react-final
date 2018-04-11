export default function() {
	if (Object.keys(this.entities.players.individuals).length > 0) {
		this.vars.score += 1;
		this.vars.playerScore.setText("score: " + this.vars.score);

		// this.entities.players.group.forEach(function(player) {
		// 	if (player.y_velocity > 0) {
		// 		player.rotation = Math.atan(
		// 			player.x_velocity / player.y_velocity
		// 		);
		// 	} else if (player.y_velocity === 0.0) {
		// 		if (player.x_velocity < 0) {
		// 			player.rotation = 0.5 * Math.PI;
		// 		} else {
		// 			player.rotation = 1.5 * Math.PI;
		// 		}
		// 	} else {
		// 		player.rotation = Math.atan(player.x_velocity / player.y_velocity) + Math.PI;
		// 	}
		// 	player.setVelocityX(8000.0 * player.x_velocity);
		// 	player.setVelocityY(-8000.0 * player.y_velocity);
		// });


		if (this.vars.score % 300 === 0) {
			this.enemySpawn();
		}

		this.physics.collide(
			this.entities.enemies,
			this.entities.bullets,
			this.bulletEnemyCollision,
			null,
			this
		);

		// console.log(this.entities.players);
		for (let player_id in this.entities.players.individuals) {
			// console.log("byebyebye");
			let player = this.entities.players.individuals[player_id];
			if (player.shooting) {
				this.fireBullet(player);
			}
		}

	} else {
		// Go To Gameover sequence
	}
}
