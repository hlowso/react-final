requirejs.config({
  paths: {
    'babel': './babel.min',
    'jsx': './jsx',
    'deviceDetect': './device-detect'

  }
});

requirejs(['jsx!app/index', 'jsx!app/MobileApp', "Phaser"], (App, MobileApp) => {

  const isMobile = () => {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  };

  
});



