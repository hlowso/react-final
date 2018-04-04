define([], () => {

	class MobileApp extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				connected: false,
				message: "This is the Mobile App",
				configuring: false,
				ovec: {
					alpha: 0.0,
					beta: 0.0,
					gamma: 0,0
				}
			};
			this.ws = new WebSocket(
				window.location.origin.replace(/^http/, 'ws')
			);
		}

		// getMotionHandler() {
		// 	return function(event) {
		// 		ws.send(JSON.stringify({
		// 			device: 'mobile',
					
		// 		}));
		// 	};
		// };

		componentDidMount() {

			// const motionHandler = (event) => {
			// 	this.send({
			// 		subject: 'push',
			// 		acv: event.acceleration
			// 	});
			// };

			const orientationHandler = (event) => {
				this.setState({
					ovec: {
						alpha: event.alpha,
						beta: event.beta + 180.0,
						gamma: event.gamma + 90.0
					} 
				});
				// this.send({
				// 	subject: 'push',
				// 	ovec: {
				// 		alpha: event.alpha,
				// 		beta: event.beta + 180.0,
				// 		gamma: event.gamma + 90.0
				// 	}
				// });
			};

			this.ws.onopen = () => {
		  	this.send({
		  		subject: 'connect',
		  		code: 'buster'
		  	});
			};

			this.ws.onmessage = () => {
				this.setState({
					connected: true,
					message: "Found your laptop! Click the button when you're ready to begin configuring."
				});
				window.addEventListener(
					'deviceorientation',
					orientationHandler,
					//'devicemotion', 
					//motionHandler, 
					true
				);
			};
		}

		send(data) {
			const message = {
				device: 'mobile'
			};
			for(let key in data) {
				message[key] = data[key];
			}
			this.ws.send(JSON.stringify(message));
		}

		configHandler() {
			const configuring = true;
			const ovecs = [];
			// this.setState({
			// 	configuring: true
			// });
			setTimeout(() => {
				// this.setState({
				// 	configuring: false
				// })
				configuring = false;
			}, 5000);

			while(configuring) {
				ovecs.push
			}

		}

		render() {
			const config_botton = this.state.connected && (
				<button onClick={this.configHandler}>
					Configure
				</button>
			);
			return (
				<h1>{this.state.message}</h1>
			);
		}
	}

	return MobileApp;
});