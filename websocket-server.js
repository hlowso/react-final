const WebSocket = require("ws");
const SocketServer = WebSocket.Server;
const uuid = require("uuid-v4");
const MAX_PLAYER_COUNT = 3;

const handleDesktopMessage = (ws, message) => {
	const id = uuid();
	links.push({
		id,
		code: message.code,
		desktopSocket: ws,
		mobileSockets: []
	});
	ws.link_id = id;
};

const handleMobileMessage = (ws, message) => {
	let link;

	switch (message.subject) {
		case "connect":
			link = links.find(
				l => l.code === message.code || message.code === "buster"
			);
			if (link) {
				if (link.mobileSockets.length < MAX_PLAYER_COUNT) {
					link.mobileSockets.push(ws);
					ws.player_id = uuid();
					ws.link_id = link.id;
					ws.send(
						JSON.stringify({
							success: true
						})
					);
					link.desktopSocket.send(
						JSON.stringify({
							subject: message.subject,
							player_id: ws.player_id
						})
					);
				} else {
					ws.send(
						JSON.stringify({
							error: "Cannot join game, too many users"
						})
					);
					console.log("Link found for mobile, but game is full");
				}
			} else {
				ws.send(
					JSON.stringify({
						error: "Invalid code, please try again"
					})
				);
				console.log("No link found for requesting mobile device");
			}
			break;
		case "push":
			link = links.find(l => l.id === ws.link_id);
			link.desktopSocket.send(
				JSON.stringify({
					subject: message.subject,
					player_id: ws.player_id,
					velocity: message.velocity
				})
			);
			break;
		case "shoot":
			link = links.find(l => l.id === ws.link_id);
			link.desktopSocket.send(
				JSON.stringify({
					subject: message.subject,
					player_id: ws.player_id,
					shooting: message.shooting
				})
			);
			break;
	}
};

const links = [];
module.exports = server => {
	const wss = new SocketServer({ server });

	wss.on("connection", ws => {
		console.log("Client connected");

		ws.on("message", data_string => {
			const message = JSON.parse(data_string);
			switch (message.device) {
				case "desktop":
					handleDesktopMessage(ws, message);
					break;
				case "mobile":
					handleMobileMessage(ws, message);
					break;
			}
		});

		ws.on("close", () => {
			console.log("Client disconnected");
		});
	});
};
