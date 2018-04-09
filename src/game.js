import generateCode from "./code-generator.js";
import PidgeonIcon from "./assets/pigeon_ph.png";
import EnemyIcon from "./assets/falcon_ph.png"
import SkyBackground from "./assets/sky.png";
import GreenLaser from "./assets/bullet38.png";

function start() {
  const gameAttributes = {
    code: generateCode(),
    spriteSize: 40,
    gameWidth: window.innerWidth * window.devicePixelRatio,
    gameHeight: window.innerHeight * window.devicePixelRatio,
    gameSpeed: 100
  };

  window.onload = function() {
    const gameConfig = {
      type: Phaser.AUTO,
      width: gameAttributes.gameWidth,
      height: gameAttributes.gameHeight,
      physics: {
        default: "arcade",
        arcade: {
          debug: true
          // gravity: { y: 20 }
        }
      },
      scene: [playGame]
    };

  const game = new Phaser.Game(gameConfig);
    // resize();
    // window.addEventListener("resize", resize, false);
  };



  let player;
  let enemies;
  let cursors;
  let bullets;
  let score = 0;
  let playerScore;
  let bulletTime = 0;
  let fireButton;
  let fireBullets = true;
  let x_velocity = 0.0;
  let y_velocity = 0.0;
  let health = 3;
  let healthText;
  let playerDisabled = false;

  const playGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function playGame() {
      Phaser.Scene.call(this, { key: "PlayGame" });
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
            code: "buster" //gameAttributes.code
          })
        );
      };
      ws.onmessage = message => {
        const velocity = JSON.parse(message.data).velocity;
        x_velocity = velocity.x;
        y_velocity = velocity.y;
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
                key: 'falcon',
                // repeat: 5,
                  setXY: {
                    x: -50,
                    y: -50
                    // stepX: 600,
                    // stepY: 60
                  }
                });

      playerScore = this.add.text(100, 100, `${score}`);

      //health = this.add.group();
      healthText = this.add.text(100, 120, 'Health: ' + health);

      cursors = this.input.keyboard.createCursorKeys();

      //////////////////////////////////

      bullets = this.physics.add.group({
        defaultKey: "laser",
        repeat: 40,
        setCollideWorldBounds: true,
        setXY: { x: -50, y: -50}

      });

      // bullets.createMultiple(40, 'laser')

      fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      this.physics.add.collider(enemies, bullets, this.bulletEnemyCollision, null, this);
      this.physics.add.collider(enemies, player, this.playerEnemyCollision, null, this);
    },

    fireBullet: function () {


      if (this.time.now > bulletTime) {
          let bullet = bullets.get();

          console.log(GreenLaser);
          if (bullet) {
              bullet.scaleX = 2;
              bullet.scaleY = 2;
              bullet.setPosition(player.body.x + 16, player.body.y + 16);
              bullet.lifespan = 2000;
              bullet.rotation = player.rotation;
              this.physics.velocityFromRotation(player.rotation, 400, bullet.body.velocity);
              bulletTime = this.time.now + 100;
          }
      }

    },

    bulletEnemyCollision: function (bullet, enemy) {
      bullet.disableBody(true, true);
      enemy.disableBody(true, true);
      enemy.destroy();
      bullet.destroy();
      score += 1000;
    },

    playerEnemyCollision: function (player, enemy) {
      // player.disableBody(true, false);
      enemy.setBounce(0.4);
      player.setTint(0xff0000)
      // setTimeout(function() {
        // player.enableBody(false, player.x, player.y, true, true), 2000
      // })
      setTimeout(function() {
        playerDisabled = false;
        console.log("disabled: ", playerDisabled)
      }, 2000)

      console.log("health: ", health);
      console.log("playerDisabled:  ", playerDisabled);

      if (!playerDisabled) {

        playerDisabled = true
        health -= 1
        healthText.setText('Health: ' + health)
        // player.enableBody(false, player.x, player.y, true, true);
        if (health <= 0) {
          player.destroy();
        }
      }
    },


    enemySpawn: function () {
      let path;
      let curve;
      let points;
      let xOrY;
      let enemyPath;
      let xCoord;
      let yCoord;
      let leftOrRight;

      const createPath = (x, y) => {
        // console.log(x, y);
        path = { t: 0, vec: new Phaser.Math.Vector2() };

        points = [x, y];

        for (let point = 0; point < Math.floor(Math.random() * ( 12 - 6 ) + 6); point++) {
          points.push(Math.random() * gameAttributes.gameWidth);
          points.push(Math.random() * gameAttributes.gameHeight);
        }

        points.push(gameAttributes.gameWidth);
        points.push(Math.random() * gameAttributes.gameHeight);

        // console.log(points.length / 2);

        curve = new Phaser.Curves.Spline(points);
        // console.log(curve);
        // console.log(curve.points);
        return curve;
      };


      xOrY = Math.floor(Math.random() * Math.floor(2));
        if (xOrY === 0) {
          xCoord = Math.floor(Math.random() * Math.floor(gameAttributes.gameWidth));
          yCoord = 0;
          enemyPath = createPath(xCoord, yCoord);
          // console.log('top');
        } else {
          yCoord = Math.floor(Math.random() * Math.floor(gameAttributes.gameHeight));
          leftOrRight = Math.floor(Math.random() * Math.floor(2));
          if (leftOrRight === 0) {
            xCoord = 0;
            enemyPath = createPath(xCoord, yCoord);
            // console.log('left');
          } else {
            xCoord = gameAttributes.gameWidth;
            enemyPath = createPath(xCoord, yCoord);
            // console.log('right');
          }
        }
        let enemy = enemies.create(enemyPath.points[0].x, enemyPath.points[0].y, 'falcon');
        // enemy.lifespan = enemyPath.points.length * 1000;

        // console.log(enemyPath.points[0]);

        enemy.setCollideWorldBounds(true);


        let enemyTimeline = this.tweens.createTimeline({
          // onComplete: onCompleteHandler,
          // onCompleteParams: [enemy]
        });

        // function onCompleteHandler (tween, targets, enemy) {
        //   console.log(enemy);
        //   enemy.destroy();
        // }

        for (let i = 1; i < enemyPath.points.length; i++) {
          enemyTimeline.add({
            targets: enemy,
            x: enemyPath.points[i].x,
            ease: 'Sine.easeInOut',
            duration: 1000
          });
          enemyTimeline.add({
            targets: enemy,
            y: enemyPath.points[i].y,
            ease: 'Sine.easeInOut',
            duration: 1000
          });
        }
        console.log(enemyTimeline);
        // enemyTimeline.setCallback('onComplete', onCompleteHandler, [enemy]);
        enemyTimeline.play();
        // if (enemyTimeline.elapsed ===  enemyTimeline.duration) {
        //   console.log("hihih");
        //   enemy.destroy();
        // }


        // curve.getPoint(path.t, path.vec);



        // graphics.fillCircle(path.vec.x, path.vec.y, 8);
    },



    update: function() {

      score += 1;
      playerScore.setText('score: ' + score);

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
      player.setVelocityX(2000.0 * x_velocity);
      player.setVelocityY(-2000.0 * y_velocity);

      // let enemySpawn ;
      // let xCoord, yCoord, xOrY, leftOrRight;

      if (score % 100 === 0) {
        // xOrY = Math.floor(Math.random() * Math.floor(2));
        // if (xOrY === 0) {
        //   xCoord = Math.floor(Math.random() * Math.floor(1920));
        //   yCoord = 0;
        // } else {
        //   yCoord = Math.floor(Math.random() * Math.floor(1080));
        //   leftOrRight = Math.floor(Math.random() * Math.floor(2));
        //   if (leftOrRight === 0) {
        //     xCoord = 0;
        //   } else {
        //     xCoord = 1;
        //   }
        // }
        // enemySpawn = enemies.create(xCoord, yCoord, 'falcon');
        this.enemySpawn();
      }

      // enemies.setVelocityY(300);
      // enemies.setVelocityX(300);


      if (fireButton.isDown === true) {
        this.fireBullet();
      }



    }
  });

  function resize() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
      canvas.style.width = windowWidth + "px";
      canvas.style.height = windowWidth / gameRatio + "px";
    } else {
      canvas.style.width = windowHeight * gameRatio + "px";
      canvas.style.height = windowHeight + "px";
    }
  }
}

export default start;
