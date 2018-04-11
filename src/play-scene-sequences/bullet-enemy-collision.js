export default function(enemy, bullet) {
	this.entities.players.individuals[bullet.player_id].killcount++;
	this.vars.score += 1000;
	enemy.destroy();
	bullet.destroy();
}
