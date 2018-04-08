import React from "react";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ship: {
				index: "10-10",
				coords: [10, 10]
			},
			code: "buster",
			ovec: {
				alpha: 0.0,
				beta: 0.0,
				gamma: 0.0
			}
		};
	}

	componentDidMount() {
		this.ws = new WebSocket(window.location.origin.replace(/^http/, "ws"));
		this.ws.onopen = () => {
			this.ws.send(
				JSON.stringify({
					device: "desktop",
					code: this.state.code
				})
			);
		};
		this.ws.onmessage = message => {
			const data = JSON.parse(message.data);
			console.log(data);
			this.setState({
				ovec: data.ovec
			});
		};
	}

	render() {
		return (
			<div className="data">
				<ul>
					<li>alpha: {this.state.ovec.alpha}</li>
					<li>beta: {this.state.ovec.beta}</li>
					<li>gamma: {this.state.ovec.gamma}</li>
				</ul>
			</div>
		);
	}
}

export default App;
