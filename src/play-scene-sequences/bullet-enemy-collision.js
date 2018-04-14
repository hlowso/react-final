

export default function(enemy, bullet) {
	if (bullet) {
    let killcount = ++this.entities.players.individuals[bullet.player_id]
      .killcount;
		this.vars.playerTexts[bullet.player_id].killcount.setText(
			"Kill Count: " + killcount
		);

		this.destroyEnemy(enemy);
		// enemy.destroy();

		bullet.destroy();
	}
}
