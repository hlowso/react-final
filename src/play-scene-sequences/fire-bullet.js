export default function(player) {
	if (this.time.now > this.vars.bulletTime) {
		let bullet = this.entities.bullets.get();

		if (bullet) {
			bullet.scaleX = 2;
			bullet.scaleY = 2;
			bullet.setPosition(
				player.body.x + 16,
				player.body.y + 16
			);
			bullet.lifespan = 2000;
			bullet.rotation = player.rotation;
			this.physics.velocityFromRotation(
				player.rotation,
				1000,
				bullet.body.velocity
			);
			this.vars.bulletTime = this.time.now + 100;
		}
	}
}
