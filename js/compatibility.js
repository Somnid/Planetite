var Compatibility = (function(){
	
	var requestAnimationFrameFunc = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
	
	var hasCanvas = !!document.createElement('canvas').getContext;
	var hasAnimationFrame = !!requestAnimationFrameFunc;
	var hasLocalStorage = !!window.localStorage;
	
	//optional
	var hasGamepads = !!navigator.webkitGamepads || !!navigator.mozGamepads;
	
	var pub = {
		requirementCheck : 	function (){
			requirements = document.getElementById("requirements");
			var canvas = document.createElement("li");
			canvas.innerHTML = "Canvas: " + hasCanvas; 
			requirements.appendChild(canvas);
			var animationFrame = document.createElement("li");
			animationFrame.innerHTML = 'RequestAnimationFrame: ' + hasAnimationFrame;
			requirements.appendChild(animationFrame);
			var localStorage = document.createElement("li");
			localStorage.innerHTML = 'LocalStorage: ' + hasLocalStorage;
			requirements.appendChild(localStorage);
			
			//optional
			var gamepad = document.createElement("li");
			gamepad.innerHTML = 'Gamepad: ' + hasGamepads;
			requirements.appendChild(gamepad)
		
			return hasCanvas && hasAnimationFrame && hasLocalStorage;
		},
		requestAnimationFrame: function(func, element){
			requestAnimationFrameFunc(func, element);
		}
	};
	
	return pub;
	
})();