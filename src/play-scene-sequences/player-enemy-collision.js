export default function(enemy, player) {
	// player.disableBody(true, false);
	enemy.setBounce(0.4);
	player.setTint(0xff0000);
	// setTimeout(function() {
	// player.enableBody(false, player.x, player.y, true, true), 2000
	// })
	setTimeout(() => {
		player.playerDisabled = false;
		// console.log("disabled: ", playerDisabled);
		player.setTint(0xffffff);
	}, 2000);

	// console.log("health: ", health);
	// console.log("playerDisabled:  ", playerDisabled);

	if (!player.playerDisabled) {
		player.playerDisabled = true;
		player.health -= 1;
		// player.healthText.setText("Health: " + player.health);
		// player.enableBody(false, player.x, player.y, true, true);
		if (player.health <= 0) {
			player.alive = false;
			player.destroy();
		}
	}
}
