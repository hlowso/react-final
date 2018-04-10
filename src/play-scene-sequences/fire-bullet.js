export default function() {
	if (this.time.now > this.vars.bulletTime) {
		let bullet = this.entities.bullets.get();

		if (bullet) {
			bullet.scaleX = 2;
			bullet.scaleY = 2;
			bullet.setPosition(
				this.entities.player.body.x + 16,
				this.entities.player.body.y + 16
			);
			bullet.lifespan = 2000;
			bullet.rotation = this.entities.player.rotation;
			this.physics.velocityFromRotation(
				this.entities.player.rotation,
				1000,
				bullet.body.velocity
			);
			this.vars.bulletTime = this.time.now + 100;
		}
	}
}
