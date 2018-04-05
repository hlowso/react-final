// TODO ensure that while the user is configuring, if they're straddling the line between -180 and 180, then that's taken into account

define([], () => {

	const initial_alphas = [];

	class MobileApp extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				connected: false,
				message: "This is the Mobile App",
				message2: "this will change",
				ovec: {
					alpha: 0.0,
					beta: 0.0,
					gamma: 0.0
				},
				alpha_offset: 0.0,
				povec: {
					r: 0.0,
					x: 0.0,
					y: 0.0
				},
				useOrientaion: () => {}
			};
			this.ws = new WebSocket(
				window.location.origin.replace(/^http/, 'ws')
			);
			this.configHandler = this.configHandler.bind(this);
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
				


				// SO THE ONLY PREPROCESSING WE DO ON THE OVEC
				// IS TO GIVE ALPHA THE SAME RANGE AS BETA

				const adjusted_alpha    = event.alpha - 180.0;
				const normalized_alpha  = adjusted_alpha - this.state.alpha_offset;
				let readjusted_alpha;

				if(normalized_alpha > 180) {
					readjusted_alpha = normalized_alpha - 360.0;
				}
				else if(normalized_alpha < -180.0) {
					readjusted_alpha = normalized_alpha + 360.0;
				}
				else {
					readjusted_alpha = normalized_alpha;
				}

				this.setState({
					
					ovec: {
						alpha: readjusted_alpha, 
						beta: event.beta, 
						gamma: event.gamma
					} 
				}, this.state.useOrientaion());

				
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
					useOrientaion: () => {
						this.setState({
							message: `Found your laptop: ${this.state.ovec}`
						});
					}
				});
				window.addEventListener(
					'deviceorientation',
					orientationHandler,
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

		configHandler(event) {

			this.setState({ 
				message2: "you clicked",
				useOrientaion: () => {
					initial_alphas.push(this.state.ovec.alpha);
				}
			}, setTimeout(() => {
					const alpha_sum = initial_alphas.reduce((sum, a) => sum + a);
					const alpha_offset = alpha_sum / initial_alphas.length;
					this.setState({
						alpha_offset,
						// message: `Configuring is done! The length of that array is ${initial_alphas.length}, also alpha_sum is ${alpha_sum}, and alpha_offset is ${alpha_offset}`,
						message2: `Here's your offset: alpha_offset: ${alpha_offset}`,
						

// USE THE FOLLOWING FOR THE TRANSFORM
				// this.setState({
				// 	ovec: {
				// 		alpha: (1.0 - C) * a + C * b - this.state.origin.alpha, 
				// 		beta: (1.0 - C) * b + C * a - this.state.origin.beta, 
				// 		gamma: g - this.state.origin.gamma
				// 	} 
				// }, this.state.useOrientaion());


						useOrientaion: () => {
							const a = this.state.ovec.alpha;
							const b = this.state.ovec.beta;
							const g = this.state.ovec.gamma;
							const C = Math.abs(g) / 90.0;

							let beta_component_for_x,
									alpha_component_for_x,
									x,
									y;

							if(g > 0.0) {
								if(b > 0.0) {
									beta_component_for_x = b - 180.0;
								}
								else {
									beta_component_for_x = b + 180.0;
								}
								if(a > 0.0) {
									alpha_component_for_x = a - 180.0;
								}
								else {
									alpha_component_for_x = a + 180.0;
								}
								y = -1.0 * (g - 90.0);
							}
							else {
								beta_component_for_x = b;
								alpha_component_for_x = a;
								y =  -1.0 * (g + 90.0); 
							}

							x = ((1.0 - C) * beta_component_for_x + C * alpha_component_for_x);
							


							// const r = (1.0 - C) * a + C * b;

							// let x = (1.0 - C) * b + C * a;
							// let y =  ? g - 180.0 : g;
							

							

							// if(x > 90.0) {
							// 	x -= 180.0;
							// }
							// else if(x < -90.0) {
							// 	x += 180.0;
							// }

							// if(alpha > 90.0 || alpha < -90.0) {
							// 	y *= -1.0;
							// 	x *= -1.0;
							// }

							

							this.setState({
								povec: {
									// a,
									// b,
									// g,
									// C,
									alpha: 0.0,
									x,
									y
								}
							});
						}
					});
				}, 1000)
			
			);

		}

		render() {

			const config_button = this.state.connected && (
				<button onClick={this.configHandler}>
					Configure
				</button>
			);
			return (
				<div>
					<h1>RENDERING</h1>
					<h1>{this.state.message}</h1>
					<h1>{this.state.message2}</h1>
					<ul>
						<li>alpha: {this.state.ovec.alpha}</li>
						<li>beta: {this.state.ovec.beta}</li>
			 			<li>gamma: {this.state.ovec.gamma}</li>

			 			<li> PROCESSED </li>

						<li>r: {this.state.povec.r}</li>
						<li>x: {this.state.povec.x}</li>
			 			<li>y: {this.state.povec.y}</li>

					</ul>
					{config_button}
				</div>
			);

		}
	}

	return MobileApp;
});