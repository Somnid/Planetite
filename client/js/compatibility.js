"use strict";

var Compatibility = (function(){
	
	var requestAnimationFrameFunc = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
	
	var hasCanvas = !!document.createElement('canvas').getContext;
	var hasAnimationFrame = !!requestAnimationFrameFunc;
	var hasLocalStorage = !!window.localStorage;
	
	//optional
	var hasGamepads = !!navigator.webkitGamepads || !!navigator.mozGamepads;
	
	return {
		requestAnimationFrame: function(func, element){
			requestAnimationFrameFunc(func, element);
		}
	};
})();