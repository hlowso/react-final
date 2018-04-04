requirejs.config({
  paths: {
    'babel': './babel.min',
    'jsx': './jsx',
    'deviceDetect': './device-detect'
  }
});

requirejs(['jsx!app/index', 'jsx!app/MobileApp'], (App, MobileApp) => {
  
  const isMobile = () => {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)); 
  };

  const Comp = (isMobile()) ? MobileApp : App;
	ReactDOM.render(
		React.createElement(Comp), 
		document.getElementById('root')
	);
}); 



