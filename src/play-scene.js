import initialize from "./play-scene-sequences/initialize.js";
import init from "./play-scene-sequences/init.js";
import preload from "./play-scene-sequences/preload.js";
import create from "./play-scene-sequences/create.js";
import update from "./play-scene-sequences/update.js";
import fireBullet from "./play-scene-sequences/fire-bullet.js";
import bulletEnemyCollision from "./play-scene-sequences/bullet-enemy-collision.js";
import playerEnemyCollision from "./play-scene-sequences/player-enemy-collision.js";
import enemySpawn from "./play-scene-sequences/enemy-spawn.js";

const play = new Phaser.Class({
  // The entities and vars objects exclusively contain
  // objects and data defined by the development team.
  entities: {},
  vars: {},

  Extends: Phaser.Scene,

  initialize,
  init,
  preload,
  create,
  fireBullet,
  bulletEnemyCollision,
  playerEnemyCollision,
  enemySpawn,
  update
});

export default play;
