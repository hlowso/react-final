export default function(enemy, bullet) {
	if (bullet) {
		let killcount = ++this.entities.players.individuals[bullet.player_id]
			.killcount;
		this.vars.score += 1000;

		let boom = this.add.sprite(enemy.x, enemy.y, "explosion");
		boom.anims.play("explode");

		enemy.destroy();
		bullet.destroy();
		this.vars.playerTexts[bullet.player_id].killcount.setText(
			"Kill Count: " + killcount
		);

		if (Math.floor(Math.random() * 100) > 75) {
			let type = Math.floor(Math.random() * this.entities.bonuses.types.length);
			let bonus = this.entities.bonuses.group.create(enemy.x, enemy.y, this.entities.bonuses.types[type]);
			bonus.type = type;
			setTimeout(() => {
				bonus.destroy();
			}, 5000);
		}
	}
}
