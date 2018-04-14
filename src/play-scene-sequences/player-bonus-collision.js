export default function(player, bonus) {
  if (bonus) {
    bonus.disableBody(true, true);
    switch (bonus.type) {
      case "heart":
        player.health++;
        bonus.destroy();
        this.vars.playerTexts[player.id].health.setText(player.health > 5 ?
        `Health: ❤️ x ${player.health}` : `Health: ${'❤️'.repeat(player.health)}`
        );
        break;
      case "bomb":
        bonus.destroy();
        console.log(this.entities.enemies);
        let enemies = this.entities.enemies.getChildren();
        if (enemies.length > 0) {
          let killcount = player.killcount += enemies.length;
          this.vars.playerTexts[player.id].killcount.setText(
            "Kill Count: " + killcount
          );
          enemies.forEach(this.destroyEnemy.bind(this));
        }
        break;
    }

  }
}