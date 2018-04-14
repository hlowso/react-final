import gameAttributes from "./game-attributes.js";
import create from "./lobby-scene-sequences/create.js";
import initialize from "./lobby-scene-sequences/initialize.js";
import preload from "./lobby-scene-sequences/preload.js";
import init from "./lobby-scene-sequences/init.js";

const lobbyScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize,
	preload,
	init,
	create
});

export default lobbyScene;
