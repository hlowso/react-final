export default function(player) {
	if (this.time.now > this.vars.bulletTime) {
		let bullet = this.entities.bullets.create(
			player.body.x,
			player.body.y,
			"laser"
		);
		if (bullet) {
			bullet.scaleX = 2;
			bullet.scaleY = 2;
			bullet.lifespan = 2000;
			bullet.rotation = player.rotation;
			bullet.player_id = player.id;

			this.physics.velocityFromRotation(
				player.rotation,
				1000,
				bullet.body.velocity
			);
			this.vars.bulletTime = this.time.now + 100;
		}
	}
}
