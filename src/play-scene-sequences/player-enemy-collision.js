export default function(enemy, player) {
	if(!isNaN(player.health)) {
		enemy.setBounce(0.4);
		player.setTint(0xff0000);

		setTimeout(() => {
			player.playerDisabled = false;
			player.setTint(0xffffff);
		}, 2000);

		if (!player.playerDisabled) {
			player.playerDisabled = true;
			player.health -= 1;
			// console.log(player.id);
			// console.log(player);
			// let id = player.id.toString();
			this.vars.playerTexts[player.id].health.setText('Health: ' + player.health);

			if (player.health <= 0) {
				player.alive = false;
				player.disableBody(true, true);
			}
		}
	}
}
