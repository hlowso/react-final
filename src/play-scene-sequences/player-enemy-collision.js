export default function(enemy, player) {
	if (!isNaN(player.health)) {
		// Set a damaged tint on the player upon collision with an enemy
		enemy.setBounce(0.4);
		player.setTint(0xff0000);

		// Remove the invulnerability and damaged tint on the player.
		setTimeout(() => {
			player.playerDisabled = false;
			player.setTint(0xffffff);
		}, 2000);

		// If player is not currently disabled (recently hit), then disable them temporarily and subtract one health.
		// Disabling them gives them temporary invulnerability
		if (!player.playerDisabled) {
			player.playerDisabled = true;
			player.health -= 1;
			// Refresh the player health text to reflect the damage taken
			this.vars.playerTexts[player.id].health.setText(player.health > 5 ?
				`Health: ❤️ x ${player.health}` : `Health: ${'❤️'.repeat(player.health)}`
			);

			// If player has no health left, set player.alive = false. When all players are like this, game_over becomes true in the play scene update loop and the game ends.
			if (player.health <= 0) {
				player.alive = false;
				player.disableBody(true, true);
				this.entities.emitters[player.id].on = false;
			}
		}
	}
}
