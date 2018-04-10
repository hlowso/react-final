import gameAttributes from "../game-attributes.js";

export default function() {
	// TEMPORARY PLACEMENT FOR WS
	const ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
	ws.onopen = () => {
		ws.send(
			JSON.stringify({
				device: "desktop",
				code: gameAttributes.code
			})
		);
	};
	ws.onmessage = incoming_message => {
		const message = JSON.parse(incoming_message.data);
		switch (message.subject) {
			case "connect":
				console.log("player connecting with id:", message.player_id);
				break;
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

	this.entities.player = this.physics.add.sprite(
		gameAttributes.gameWidth / 2,
		gameAttributes.gameHeight / 2,
		"pigeon"
	);

	this.entities.player.alive = true;

	this.entities.player.setBounce(0.4);
	this.entities.player.setCollideWorldBounds(true);

	this.entities.player.setVelocityX(0);
	this.entities.player.setVelocityY(0);

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
	this.vars.playerScore = this.add.text(100, 100, `${this.vars.sscore}`);

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
		this.entities.player,
		this.playerEnemyCollision,
		null,
		this
	);
}
