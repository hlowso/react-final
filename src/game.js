import generateCode from "./code-generator.js";
import PidgeonIcon from "./assets/pigeon_ph.png";
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
  let cursors;
  let bullets;
  let bulletTime = 0;
  let fireButton;
  let fireBullets = true;
  let x_velocity = 0.0;
  let y_velocity = 0.0;

  const playGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function playGame() {
      Phaser.Scene.call(this, { key: "PlayGame" });
    },

    preload: function() {
      this.load.image("background", SkyBackground);
      this.load.image("pigeon", PidgeonIcon, 129, 84);
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


    update: function() {
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

      // console.log(fireButton)

      if (fireButton.isDown === true) {
        this.fireBullet();
      }



      // if (cursors.left.isDown) {
      //   player.setVelocityX(-800);
      // } else if (cursors.right.isDown) {
      //   player.setVelocityX(800);
      // } else {
      //   player.setVelocityX(0);
      // }
      // if (cursors.up.isDown) {
      //   player.setVelocityY(-800);
      // } else if (cursors.down.isDown) {
      //   player.setVelocityY(800);
      // } else {
      //   player.setVelocityY(0);
      // player.body.setGravity(100);
      // }
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
