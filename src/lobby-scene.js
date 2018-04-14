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

	init: function(data) {
		if (data.vars && Object.keys(data.vars).length) {
			this.vars = data.vars;
			console.log(this.vars);
		} else {
			this.vars = {
				player_ids: [],
				player_names: {}
			};
		}
	},

	create
});

export default lobbyScene;
