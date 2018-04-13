// TODO bullet.player_id not always defined...
// Another comment

export default function(enemy, bullet) {
	if (bullet) {
		let killcount = ++this.entities.players.individuals[bullet.player_id]
			.killcount;
		this.vars.score += 1000;


		let boom = this.add.sprite(enemy.x, enemy.y, 'explosion');
		boom.anims.play('explode');

		enemy.destroy();
		bullet.destroy();
		this.vars.playerTexts[bullet.player_id].killcount.setText(
			"Kill Count: " + killcount
		);
	}
}
