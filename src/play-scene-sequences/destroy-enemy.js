export default function (enemy) {
  if (enemy) {
    this.vars.score += 1000;

    let boom = this.add.sprite(enemy.x, enemy.y, "explosion");
    boom.anims.play("explode");

    enemy.destroy();

    if (Math.floor(Math.random() * 100) > 0) {
      let type = Math.floor(Math.random() * this.entities.bonuses.types.length);
      let bonus = this.entities.bonuses.group.create(enemy.x, enemy.y, this.entities.bonuses.types[type]);
      bonus.type = this.entities.bonuses.types[type];
      // setTimeout(() => {
      //  bonus.destroy();
      // }, 5000);
    }
  }
}