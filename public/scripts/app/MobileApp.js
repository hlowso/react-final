// TODO ensure that while the user is configuring, if they're straddling the line between -180 and 180, then that's taken into account
// TODO make it so that it doesn't matter if they have their phone with their right thumb on the home button, or their left thumb on the home button

define([], () => {

	const initial_alphas = [];
	const initial_gammas = [];


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
				velocity: {
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

		componentDidMount() {

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
					initial_gammas.push(this.state.ovec.gamma);
				}
			}, setTimeout(() => {
					const alpha_sum = initial_alphas.reduce((sum, a) => sum + a);
					const gamma_sum = initial_gammas.reduce((sum, a) => sum + a);

					const alpha_offset = alpha_sum / initial_alphas.length;
					const gamma_offset = alpha_sum / initial_gammas.length;

					const y_zero = (gamma_offset > 0.0) ? -1.0 (gamma_offset - 90.0) : -1.0 * (gamma_offset + 90.0);

					this.setState({
						alpha_offset,
						y_zero,
						// message: `Configuring is done! The length of that array is ${initial_alphas.length}, also alpha_sum is ${alpha_sum}, and alpha_offset is ${alpha_offset}`,
						message2: `configuring is done, here is gamma ${gamma_offset}, and the length ${initial_gammas.length}, y_zero is ${y_zero}`,
						
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
								y = -1.0 * (g + 90.0); 
							}

							x = -1.0 * (((1.0 - C) * beta_component_for_x + C * alpha_component_for_x));
							y = y - this.state.y_zero;

							this.setState({
								velocity: {
									x,
									y
								}
							});
						}
					});

				}, 5000)
			);
		}

		render() {

			const calibrate_button = this.state.connected && (
				<button onClick={this.configHandler}>
					Calibrate
				</button>
			);
			return (
				<div>
					<h1>{this.state.message}</h1>
					<h1>{this.state.message2}</h1>
					<ul>
						<li>alpha: {this.state.ovec.alpha}</li>
						<li>beta: {this.state.ovec.beta}</li>
			 			<li>gamma: {this.state.ovec.gamma}</li>

			 			<li> PROCESSED </li>

						<li>x velocity: {this.state.velocity.x}</li>
			 			<li>y velocity: {this.state.velocity.y}</li>

					</ul>
					{calibrate_button}
				</div>
			);

		}
	}

	return MobileApp;
});