var Compatibility = (function(){
	
	var requestAnimationFrameFunc = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
	
	var hasCanvas = !!document.createElement('canvas').getContext;
	var hasAnimationFrame = !!requestAnimationFrameFunc;
	var hasLocalStorage = !!window.localStorage;
	
	//optional
	var hasGamepads = !!navigator.webkitGamepads || !!navigator.mozGamepads;
	
	return {
		requirementCheck : 	function (){
			$("#requirements").empty();
			$("#requirements").append('<li>Canvas: ' + hasCanvas + '</li>')
			$("#requirements").append('<li>RequestAnimationFrame: ' + hasAnimationFrame + '</li>')
			$("#requirements").append('<li>LocalStorage: ' + hasLocalStorage + '</li>')
			
			//optional
			$("#requirements").append('<li>Gamepad: ' + hasGamepads + '</li>')
		
			return hasCanvas && hasAnimationFrame && hasLocalStorage;
		},
		requestAnimationFrame: function(func, element){
			requestAnimationFrameFunc(func, element);
		}
	};
})();