export default function(bullet, enemy) {
	bullet.disableBody(true, true);
	enemy.disableBody(true, true);
	enemy.destroy();
	bullet.destroy();
	this.vars.score += 1000;
}
