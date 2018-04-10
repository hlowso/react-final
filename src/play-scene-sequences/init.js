export default function(data) {
	// console.log(data);
	// console.log(this.vars);
	this.vars.ws = data.ws;
	this.vars.player_ids = data.player_ids;
	// this.vars = { ...data, ...this.vars };
}
