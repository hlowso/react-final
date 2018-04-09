import gameAttributes from "./game-attributes.js";
import PidgeonIcon from "./assets/pigeon_ph.png";
import EnemyIcon from "./assets/falcon_ph.png";
import SkyBackground from "./assets/sky.png";
import GreenLaser from "./assets/bullet38.png";

let player;
let enemies;
let cursors;
let bullets;
let score = 0;
let playerScore;
let bulletTime = 0;
let fireBullets = true;
let x_velocity = 0.0;
let y_velocity = 0.0;
let shooting = false;
let health = 3;
let healthText;
let playerDisabled = false;

const play = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function() {
    Phaser.Scene.call(this, { key: "Play" });
  },

  preload: function() {
    this.load.image("background", SkyBackground);
    this.load.image("pigeon", PidgeonIcon, 129, 84);
    this.load.image("falcon", EnemyIcon, 85, 56);
    this.load.image("laser", GreenLaser);
  },

  create: function() {
    // TEMPORARY PLACEMENT FOR WS
    const ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          device: "desktop",
          code: gameAttributes.code
        })
      );
    };
    ws.onmessage = incoming_message => {
      const message = JSON.parse(incoming_message.data);
      switch (message.subject) {
        case "push":
          x_velocity = message.velocity.x;
          y_velocity = message.velocity.y;
          break;
        case "shoot":
          shooting = message.shooting;
          break;
      }
    };
    // ---------------

    const background = this.add.image(
      gameAttributes.gameWidth / 2,
      gameAttributes.gameHeight / 2,
      "background"
    );

    background.setScale(window.devicePixelRatio * 2);

    player = this.physics.add.sprite(
      gameAttributes.gameWidth / 2,
      gameAttributes.gameHeight / 2,
      "pigeon"
    );

    player.setBounce(0.4);
    player.setCollideWorldBounds(true);

    player.setVelocityX(0);
    player.setVelocityY(0);

    enemies = this.physics.add.group({
      key: "falcon",
      // repeat: 5,
      setXY: {
        x: -50,
        y: -50
        // stepX: 600,
        // stepY: 60
      }
    });

    this.add.text(100, 200, `Code: ${gameAttributes.code}`);
    playerScore = this.add.text(100, 100, `${score}`);

    //health = this.add.group();
    healthText = this.add.text(100, 120, "Health: " + health);

    cursors = this.input.keyboard.createCursorKeys();

    //////////////////////////////////

    bullets = this.physics.add.group({
      defaultKey: "laser",
      repeat: 40,
      setCollideWorldBounds: true,
      setXY: { x: -50, y: -50 }
    });

    // bullets.createMultiple(40, 'laser')

    this.physics.add.collider(
      enemies,
      bullets,
      this.bulletEnemyCollision,
      null,
      this
    );
    this.physics.add.collider(
      enemies,
      player,
      this.playerEnemyCollision,
      null,
      this
    );
  },

  fireBullet: function() {
    if (this.time.now > bulletTime) {
      let bullet = bullets.get();

      if (bullet) {
        bullet.scaleX = 2;
        bullet.scaleY = 2;
        bullet.setPosition(player.body.x + 16, player.body.y + 16);
        bullet.lifespan = 2000;
        bullet.rotation = player.rotation;
        this.physics.velocityFromRotation(
          player.rotation,
          1000,
          bullet.body.velocity
        );
        bulletTime = this.time.now + 100;
      }
    }
  },

  bulletEnemyCollision: function(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.disableBody(true, true);
    enemy.destroy();
    bullet.destroy();
    score += 1000;
  },

  playerEnemyCollision: function(player, enemy) {
    // player.disableBody(true, false);
    enemy.setBounce(0.4);
    player.setTint(0xff0000);
    // setTimeout(function() {
    // player.enableBody(false, player.x, player.y, true, true), 2000
    // })
    setTimeout(function() {
      playerDisabled = false;
      // console.log("disabled: ", playerDisabled);
      player.setTint(0xffffff);
    }, 2000);

    // console.log("health: ", health);
    // console.log("playerDisabled:  ", playerDisabled);

    if (!playerDisabled) {
      playerDisabled = true;
      health -= 1;
      healthText.setText("Health: " + health);
      // player.enableBody(false, player.x, player.y, true, true);
      if (health <= 0) {
        player.destroy();
      }
    }
  },

  enemySpawn: function() {
    let path;
    let curve;
    let points;
    let xOrY;
    let enemyPath;
    let xCoord;
    let yCoord;
    let leftOrRight;

    const createPath = (x, y) => {
      path = { t: 0, vec: new Phaser.Math.Vector2() };

      points = [x, y];

      for (
        let point = 0;
        point < Math.floor(Math.random() * (12 - 6) + 6);
        point++
      ) {
        points.push(Math.random() * gameAttributes.gameWidth);
        points.push(Math.random() * gameAttributes.gameHeight);
      }

      points.push(gameAttributes.gameWidth);
      points.push(Math.random() * gameAttributes.gameHeight);

      curve = new Phaser.Curves.Spline(points);
      // console.log(curve.points);
      return curve;
    };

    xOrY = Math.floor(Math.random() * Math.floor(2));
    if (xOrY === 0) {
      xCoord = Math.floor(Math.random() * Math.floor(gameAttributes.gameWidth));
      yCoord = 0;
      enemyPath = createPath(xCoord, yCoord);
    } else {
      yCoord = Math.floor(
        Math.random() * Math.floor(gameAttributes.gameHeight)
      );
      leftOrRight = Math.floor(Math.random() * Math.floor(2));
      if (leftOrRight === 0) {
        xCoord = 0;
        enemyPath = createPath(xCoord, yCoord);
      } else {
        xCoord = gameAttributes.gameWidth;
        enemyPath = createPath(xCoord, yCoord);
      }
    }
    let enemy = enemies.create(
      enemyPath.points[0].x,
      enemyPath.points[0].y,
      "falcon"
    );

    enemy.setCollideWorldBounds(true);

    let enemyTimeline = this.tweens.createTimeline({
      yoyo: true,
      loop: true
    });

    for (let i = 1; i < enemyPath.points.length; i++) {
      enemyTimeline.add({
        targets: enemy,
        x: enemyPath.points[i].x,
        ease: "Sine.easeInOut",
        duration: 1000
      });
      enemyTimeline.add({
        targets: enemy,
        y: enemyPath.points[i].y,
        ease: "Sine.easeInOut",
        duration: 1000
      });
    }
    enemyTimeline.play();
  },

  update: function() {
    score += 1;
    playerScore.setText("score: " + score);

    if (y_velocity > 0) {
      player.rotation = Math.atan(x_velocity / y_velocity);
    } else if (y_velocity === 0.0) {
      if (x_velocity < 0) {
        player.rotation = 0.5 * Math.PI;
      } else {
        player.rotation = 1.5 * Math.PI;
      }
    } else {
      player.rotation = Math.atan(x_velocity / y_velocity) + Math.PI;
    }

    player.setVelocityX(8000.0 * x_velocity);
    player.setVelocityY(-8000.0 * y_velocity);

    if (score % 1000 === 0) {
      this.enemySpawn();
    }

    this.physics.collide(
      enemies,
      bullets,
      this.bulletEnemyCollision,
      null,
      this
    );

    if (shooting) {
      this.fireBullet();
    }
  }
});

export default play;
