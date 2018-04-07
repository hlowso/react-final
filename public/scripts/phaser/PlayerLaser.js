class PlayerLaser extends Phaser.GameObjects.Image {

  constructor = () => {
    super();
  }

  PlayerLaser = (scene) => {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'green_laser');

    this.speed = Phaser.Math.GetSpeed(1000, 1);
  };

  fire = (x, y, velocityX, velocityY) => {
    this.setActive(true);
    this.setVisible(true);

    this.setPosition(x, y);
    // this.setVelocityX(velocityX).setVelocityY(velocityY);

    var angle = Phaser.Math.Angle.Between(this.x, this.y, velocityX, velocityY);
    this.setRotation(angle);

    this.incX = Math.cos(angle);
    this.incY = Math.sin(angle);
  };

  update = (time, delta) => {
    this.y -= this.speed * delta;

    if (this.y < -50) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

export default PlayerLaser