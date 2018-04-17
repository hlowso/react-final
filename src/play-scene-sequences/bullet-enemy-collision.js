

export default function(enemy, bullet) {
	if (bullet) {
		// Increase the killcount for the player the killed the enemy
    let killcount = ++this.entities.players.individuals[bullet.player_id]
      .killcount;
		this.vars.playerTexts[bullet.player_id].killcount.setText(
			"Kill Count: " + killcount
		);

		// Destroy the enemy that was hit and the bullet
		this.destroyEnemy(enemy);

		bullet.destroy();
	}
}
