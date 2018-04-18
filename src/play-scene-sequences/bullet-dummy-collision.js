export default function(enemy, bullet) {
  if (bullet) {

    let boom = this.add.sprite(enemy.x, enemy.y, "explosion");
    boom.anims.play("explode");
    enemy.destroy();

    bullet.destroy();

    if (!this.entities.dummies.getChildren().length) {
      this.time.addEvent({
        delay: 5000,
        callback: this.enemySpawn,
        callbackScope: this,
        loop: true
      });
      this.vars.tutorialText.visible = false;
      this.vars.score = 0;
      this.vars.gameScoreText.visible = true;
      this.vars.flyText.visible = true;
      setTimeout(() => {
        this.vars.flyText.visible = false;
      }, 2000);
    }
  }
}