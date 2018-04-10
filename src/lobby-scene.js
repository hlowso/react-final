import gameAttributes from "./game-attributes.js";
import create from "./lobby-scene-sequences/create.js";
import SkyBackground from "./assets/sky.png";
import NewGameButton from "./assets/new_game_button.png";

let start = false;

const lobbyScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function() {
		Phaser.Scene.call(this, { key: "Lobby" });
	},

	preload: function() {
		this.load.image("background", SkyBackground);
		this.load.image("new-game-button", NewGameButton);
	},

	init: function() {
		this.vars = {
			player_ids: []
		};
	},

	create
});

export default lobbyScene;
