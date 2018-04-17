export default function(enemy) {
  if (enemy) {
    // Increase the player's score by 1000 upon killing an enemy
    this.vars.score += 1000;

    // Creates an explosion animation on the enemy's position
    let boom = this.add.sprite(enemy.x, enemy.y, "explosion");
    boom.anims.play("explode");
    enemy.destroy();

    // Enemies have a 33% chance to drop a bonus upon killing them
    if (Math.floor(Math.random() * 100) < 33) {
      let atLeastOneDeadPlayer = false;
      let players = this.entities.players.individuals;
      let bonusList = [
        ...this.entities.bonuses.types,
        ...this.entities.bonuses.types
      ];
      // If there is atleast one player dead (player.alive = false), then adds the resurrection gemstone to the list of bonuses available to be dropped when killing an enemy. This item has a lower dropchance.
      for (let id in players) {
        if (!players[id].alive) {
          atLeastOneDeadPlayer = true;
          break;
        }
      }
      if (atLeastOneDeadPlayer) {
        bonusList.push("gem");
      }
      // Creates the bonus at the enemy's location and assigns it a random type from the array of bonus types.
      let index = Math.floor(Math.random() * bonusList.length);
      let bonus = this.entities.bonuses.group.create(
        enemy.x,
        enemy.y,
        bonusList[index]
      );
      bonus.type = bonusList[index];
      // Destroy the bonus drop after 5 seconds
      setTimeout(() => {
        bonus.destroy();
      }, 5000);
    }
  }
}
