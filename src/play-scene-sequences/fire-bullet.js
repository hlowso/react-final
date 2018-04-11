export default function(player) {
	if (this.time.now > this.vars.bulletTime) {
		console.log(this.entities.bullets);
		let bullet = this.entities.bullets.get();
		bullet.player_id = player.id;

		if (bullet) {
			bullet.scaleX = 2;
			bullet.scaleY = 2;
			bullet.setPosition(player.body.x + 16, player.body.y + 16);
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
