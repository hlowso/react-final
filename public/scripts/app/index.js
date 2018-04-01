define(['jsx!./MobileApp'], (MobileApp) => {

	const isMobile = () => {
		return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)); 
	};

	class App extends React.Component {

		renderGrid() {
			const cells = [];
			for(let y = 0; y < 20; y ++) {
				for(let x = 0; x < 20; x ++) {
					cells.push(<div className="cell" key={`${x}-${y}`}>{x}{y}</div>);
				}	
			}
			return cells;
		}

		render() {
			const ws = new WebSocket(
				window.location.origin.replace(/^http/, 'ws')
			);
			if(isMobile()) {
				return (<MobileApp ws={ws}/>);
			}
			ws.onopen = () => {
				console.log('This browser is connected');
			};
			const grid = this.renderGrid();
			return (
				<div className="grid">
					{grid}
				</div>
			);
		}
	}

	return App;
});

