chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'bounds': {
      'top': 0,
	  'left': 0,
	  'width': 1920,
      'height': 1080 + 768  // cover both screens
    },
	'frame': {
	  'type': 'none'
	}
  });
});
