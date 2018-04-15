export default function(player, bonus) {
  if (bonus) {
    bonus.disableBody(true, true);
    switch (bonus.type) {
      case "heart":
        player.health++;
        this.vars.playerTexts[player.id].health.setText(
          player.health > 5
            ? `Health: ❤️ x ${player.health}`
            : `Health: ${"❤️".repeat(player.health)}`
        );
        break;
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
      case "gem":
        let players = this.entities.players.individuals;
        for (let id in players) {
          let deadPlayer = players[id];
          if (!deadPlayer.alive) {
            deadPlayer.body.enable = true;
            deadPlayer.visible = true;
            deadPlayer.alive = true;
            deadPlayer.health = 3;
            this.vars.playerTexts[id].health.setText("Health: ❤️❤️❤️");
            this.entities.emitters[id].on = true;

            // this.vars.playerTexts[id].killcount.setText(
            //   `KillCount: ${deadPlayer.killcount}`
            // );
            break;
          }
        }
        break;
    }
    bonus.destroy();
  }
}
