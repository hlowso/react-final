define(['jsx!./MobileApp'], (MobileApp) => {

	class App extends React.Component {

		constructor(props) {
			super(props);
			this.state = {
				ship: {
					index: '10-10',
					coords: [10, 10]
				},
				code: 'buster',
				ovec: {
					alpha: 0.0, 
					beta: 0.0, 
					gamma: 0.0
				}
			}
		}

		componentDidMount() {
			this.ws = new WebSocket(
				window.location.origin.replace(/^http/, 'ws')
			);
			this.ws.onopen = () => {
				this.ws.send(JSON.stringify({
					device: 'desktop',
					code: this.state.code
				}));
			};
			this.ws.onmessage = message => {
				const data = JSON.parse(message.data);
				console.log(data);
				this.setState({
					ovec: data.ovec
				});
			};
		}

		renderGrid() {
			const cells = [];
			for(let y = 0; y < 21; y ++) {
				for(let x = 0; x < 21; x ++) {
					let key = `${x}-${y}`;
					let id = (key === this.state.ship.index) ? 'ship' : '';
					let classes = `cell ${key}`;
					let comp = (
						<div className={classes} id={id} key={key}>
							{x}{y}
						</div>
					)
					cells.push(comp);
				}	
			}
			return cells;
		}

		render() {
			//const grid = this.renderGrid();
			return (
				//<div className="grid">
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

	return App;
});

