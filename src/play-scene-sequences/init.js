export default function(data) {
	this.vars = data.vars;
	this.vars.ws.send(
		JSON.stringify({
			device: "desktop",
			subject: "listen"
		})
	);
	this.vars.score = 0;
}
