import gameAttributes from "./game-attributes.js";
import play from "./play.js";

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
  scene: [play]
};

const start = () => {
  const game = new Phaser.Game(gameConfig);
  // function resize() {
  //   const canvas = document.querySelector("canvas");
  //   const windowWidth = window.innerWidth;
  //   const windowHeight = window.innerHeight;
  //   const windowRatio = windowWidth / windowHeight;
  //   const gameRatio = game.config.width / game.config.height;
  //   if (windowRatio < gameRatio) {
  //     canvas.style.width = windowWidth + "px";
  //     canvas.style.height = windowWidth / gameRatio + "px";
  //   } else {
  //     canvas.style.width = windowHeight * gameRatio + "px";
  //     canvas.style.height = windowHeight + "px";
  //   }
  // }
  // resize();
  // window.addEventListener("resize", resize, false);
};

export default start;
