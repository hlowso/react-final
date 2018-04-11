export default function(enemy, player) {
	enemy.setBounce(0.4);
	player.setTint(0xff0000);

	setTimeout(() => {
		player.playerDisabled = false;
		player.setTint(0xffffff);
	}, 2000);

	if (!player.playerDisabled) {
		player.playerDisabled = true;
		player.health -= 1;

		if (player.health <= 0) {
			player.alive = false;
			player.disableBody(true, true);
		}
	}
}
