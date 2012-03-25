var Compatibility = (function(){
	
	var requestAnimationFrameFunc = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
	var audioContextFunc = window.audioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
	
	var hasCanvas = !!document.createElement('canvas').getContext;
	var hasAnimationFrame = !!requestAnimationFrameFunc;
	var hasLocalStorage = !!window.localStorage;
	var hasWebAudio =  !!window.audioContextFunc;
	
	//optional
	var hasGamepads = !!navigator.webkitGamepads || !!navigator.mozGamepads;
	
	return {
		requirementCheck : 	function (){
			$("#requirements").empty();
			$("#requirements").append('<li>Canvas: ' + hasCanvas + '</li>')
			$("#requirements").append('<li>RequestAnimationFrame: ' + hasAnimationFrame + '</li>')
			$("#requirements").append('<li>LocalStorage: ' + hasLocalStorage + '</li>')
			$("#requirements").append('<li>WebAudio: ' + hasWebAudio + '</li>')
			
			//optional
			$("#requirements").append('<li>Gamepad: ' + hasGamepads + '</li>')
		
			return hasCanvas && hasAnimationFrame && hasLocalStorage;
		},
		requestAnimationFrame: function(func, element){
			requestAnimationFrameFunc(func, element);
		},
		hasWebAudio : hasWebAudio
	};
})();