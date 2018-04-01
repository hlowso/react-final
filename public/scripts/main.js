requirejs.config({
  paths: {
    'babel': './babel.min',
    'jsx': './jsx',
    'deviceDetect': './device-detect'
  }
});

requirejs(['jsx!app/index'], App => {
	ReactDOM.render(
		React.createElement(App), 
		document.getElementById('root')
	);
}); 



