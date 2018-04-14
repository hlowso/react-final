export default function(data) {
	if (data.vars && Object.keys(data.vars).length) {
		this.vars = data.vars;
		console.log(this.vars);
	} else {
		this.vars = {
			player_ids: [],
			player_names: {}
		};
	}
}
