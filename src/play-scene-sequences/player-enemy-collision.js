export default function(player, enemy) {
	// player.disableBody(true, false);
	enemy.setBounce(0.4);
	player.setTint(0xff0000);
	// setTimeout(function() {
	// player.enableBody(false, player.x, player.y, true, true), 2000
	// })
	setTimeout(() => {
		this.vars.playerDisabled = false;
		// console.log("disabled: ", playerDisabled);
		player.setTint(0xffffff);
	}, 2000);

	// console.log("health: ", health);
	// console.log("playerDisabled:  ", playerDisabled);

	if (!this.vars.playerDisabled) {
		this.vars.playerDisabled = true;
		this.vars.health -= 1;
		this.vars.healthText.setText("Health: " + this.vars.health);
		// player.enableBody(false, player.x, player.y, true, true);
		if (this.vars.health <= 0) {
			this.entities.player.alive = false;
			this.entities.player.destroy();
		}
	}
}
