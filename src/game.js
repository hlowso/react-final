import generateCode from "./code-generator.js";
import PidgeonIcon from "./assets/pigeon_ph.png";
import SkyBackground from "./assets/sky.png";

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
      // let fly = player.animations.add('right', [0,1,2,3,4,5]);
      player.setBounce(0.4);
      player.setCollideWorldBounds(true);

      cursors = this.input.keyboard.createCursorKeys();
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
