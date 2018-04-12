// TODO bullet.player_id not always defined...
// Another comment

export default function(enemy, bullet) {
	if (bullet) {
		let killcount = ++this.entities.players.individuals[bullet.player_id]
			.killcount;
		this.vars.score += 1000;

		console.log(enemy);
		enemy.anims.play('explode');
		enemy.disableBody(true, false);

		setTimeout(() =>{
			enemy.destroy();
		}, 1500);
		bullet.destroy();
		this.vars.playerTexts[bullet.player_id].killcount.setText(
			"Kill Count: " + killcount
		);
	}
}
