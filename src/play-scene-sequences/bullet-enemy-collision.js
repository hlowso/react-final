// TODO bullet.player_id not always defined...

export default function(enemy, bullet) {
	if (bullet) {
		this.entities.players.individuals[bullet.player_id].killcount++;
		this.vars.score += 1000;
		enemy.destroy();
		bullet.destroy();
	}
}
