export default function(player, bonus) {
  if (bonus) {
    bonus.disableBody(true, true);
    switch (bonus.type) {
      // Increases the life total of the player up to a maximum of 10
      case "heart":
        if (player.health < 10) {
          player.health++;
          this.vars.playerTexts[player.id].health.setText(
            player.health > 5
              ? `Health: ❤️ x ${player.health}`
              : `Health: ${"❤️".repeat(player.health)}`
          );
        }
        break;
        // Kills half of the enemies currently on the screen
      case "bomb":
        let enemies = this.entities.enemies.getChildren();
        if (enemies.length > 0) {
          let killcount = (player.killcount += enemies.length);
          this.vars.playerTexts[player.id].killcount.setText(
            "Kill Count: " + killcount
          );
          enemies.forEach(this.destroyEnemy.bind(this));
        }
        break;
        // Resurrection gem that brings back to life a dead player
      case "gem":
        let players = this.entities.players.individuals;
        for (let id in players) {
          let deadPlayer = players[id];
          if (deadPlayer && !deadPlayer.alive) {
            deadPlayer.body.enable = true;
            deadPlayer.visible = true;
            deadPlayer.alive = true;
            deadPlayer.health = 3;
            this.vars.playerTexts[id].health.setText("Health: ❤️❤️❤️");
            this.entities.emitters[id].on = true;
            break;
          }
        }
        break;
    }
    bonus.destroy();
  }
}
