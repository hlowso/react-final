export default function(enemy) {
  if (enemy) {
    this.vars.score += 1000;
    let boom = this.add.sprite(enemy.x, enemy.y, "explosion");
    boom.anims.play("explode");
    enemy.destroy();

    if (Math.floor(Math.random() * 100) < 33) {
      let atLeastOneDeadPlayer = false;
      let players = this.entities.players.individuals;
      let bonusList = [
        ...this.entities.bonuses.types,
        ...this.entities.bonuses.types
      ];
      for (let id in players) {
        if (!players[id].alive) {
          atLeastOneDeadPlayer = true;
          break;
        }
      }
      if (atLeastOneDeadPlayer) {
        bonusList.push("gem");
      }
      let index = Math.floor(Math.random() * bonusList.length);
      let bonus = this.entities.bonuses.group.create(
        enemy.x,
        enemy.y,
        bonusList[index]
      );
      bonus.type = bonusList[index];
      setTimeout(() => {
        bonus.destroy();
      }, 5000);
    }
  }
}
