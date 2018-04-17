export default function(player) {
	if (this.time.now > player.bulletTime) {
		// Create a bullet and position it on the centre of the player sprite that will be shooting it
		let bullet = this.entities.bullets.create(
			player.x,
			player.y,
			"laser"
		);
		if (bullet) {
			bullet.scaleX = 2;
			bullet.scaleY = 2;
			bullet.lifespan = 2000;
			bullet.rotation = player.rotation - Math.PI / 2;
			// Give the bullet an associated player ID in order to increase that player's killcount if it hits an enemy
			bullet.player_id = player.id;

			// Shoots the bullet in the direction that the player is currently facing
			this.physics.velocityFromRotation(
				player.rotation - Math.PI / 2,
				3000,
				bullet.body.velocity
			);

			// Sets a "timeout" on shooting bullets for the player
			player.bulletTime = this.time.now + 100;
		}
	}
}
