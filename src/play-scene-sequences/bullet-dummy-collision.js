// Checks overlap between bullets and the tutorial dummies
export default function(enemy, bullet) {
  if (bullet) {

    // Explosion collision
    let boom = this.add.sprite(enemy.x, enemy.y, "explosion");
    boom.anims.play("explode");
    enemy.destroy();

    bullet.destroy();

    // If all dummies are killed, then take away the tutorial text, start the score and make it visible and in 5 seconds start the enemy spawns
    if (!this.entities.dummies.getChildren().length) {
      this.time.addEvent({
        delay: 5000,
        callback: this.enemySpawn,
        callbackScope: this,
        loop: true
      });
      this.vars.tutorialText.visible = false;
      this.vars.tutorialBox.visible = false;
      this.vars.whiteFill.visible = false;
      this.vars.score = 0;
      this.vars.gameScoreText.visible = true;
      this.vars.flyText.visible = true;
      setTimeout(() => {
        this.vars.flyText.visible = false;
      }, 2000);
    }
  }
}