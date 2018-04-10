import gameAttributes from "./game-attributes.js";
import SkyBackground from "./assets/sky.png";

const getTitleScene = game =>
	new Phaser.Class({
		Extends: Phaser.Scene,

		initialize: function(data) {
			console.log("init data: ", data);
			Phaser.Scene.call(this, { key: "Title" });
		},
		preload: function() {
			this.load.image("background", SkyBackground);
		},
		create: function(data) {
			const background = this.add.image(
				gameAttributes.gameWidth / 2,
				gameAttributes.gameHeight / 2,
				"background"
			);
			this.add.text(
				gameAttributes.width / 2,
				gameAttributes.height / 2,
				`WELCOME BITCHES! ${data}`
			);
			console.log(JSON.stringify(data));

			console.log(this);
			setTimeout(() => {
				this.scene.switch("Play", {
					data: "THIS is arbitrary data..."
				});
			}, 3000);
		},
		update: function() {}
	});

export default getTitleScene;
