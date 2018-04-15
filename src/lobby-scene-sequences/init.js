export default function(data) {
	if (data.vars && Object.keys(data.vars).length) {
		this.vars = data.vars;
		this.vars.ws.send(
			JSON.stringify({
				device: "desktop",
				subject: "listen"
			})
		);
	} else {
		this.vars = {
			player_ids: [],
			player_names: {},
			player_colours: {}
		};
	}
}
