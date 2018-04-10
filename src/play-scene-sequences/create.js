import gameAttributes from "../game-attributes.js";

export default function() {
	console.log(this.player_ids);

	// TEMPORARY PLACEMENT FOR WS

	this.vars.ws.onmessage = incoming_message => {
		const message = JSON.parse(incoming_message.data);
		switch (message.subject) {
			// case "connect":
			// 	console.log("player connecting with id:", message.player_id);
			// 	break;
			case "push":
				this.vars.x_velocity = message.velocity.x;
				this.vars.y_velocity = message.velocity.y;
				break;
			case "shoot":
				this.vars.shooting = message.shooting;
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

	this.entities.players = this.physics.group({
		key: "pigeon",
		setXY: {
			x: gameAttributes.gameWidth / 2,
			y: gameAttributes.gameHeight / 2,
			stepX: 60
		}
	});
	this.entities.players.setCollideWorldBounds(true);
	this.entities.players.setBounce(0.4);
	this.entities.players.setVelocityX(0);
	this.entities.players.setVelocityY(0);

	this.player_ids.forEach(function(player_id) {
		addPlayer(player_id);
	});

	addPlayer = (player_id) => {
		let player = this.entities.players.create(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"pigeon"
		);
		player.id = player_id;
		player.alive = true;
		player.score = 0;
		player.health = 3;
		player.shooting = false;
		player.disabled = false;
	};


	this.entities.enemies = this.physics.add.group({
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
	this.vars.playerScore = this.add.text(100, 100, `${this.vars.score}`);

	//health = this.add.group();
	this.vars.healthText = this.add.text(100, 120, "Health: " + this.vars.health);

	//cursors = this.input.keyboard.createCursorKeys();

	//////////////////////////////////

	this.entities.bullets = this.physics.add.group({
		defaultKey: "laser",
		repeat: 40,
		setCollideWorldBounds: true,
		setXY: { x: -50, y: -50 }
	});

	// bullets.createMultiple(40, 'laser')

	this.physics.add.collider(
		this.entities.enemies,
		this.entities.bullets,
		this.bulletEnemyCollision,
		null,
		this
	);
	this.physics.add.collider(
		this.entities.enemies,
		this.entities.players,
		this.playerEnemyCollision,
		null,
		this
	);
}
