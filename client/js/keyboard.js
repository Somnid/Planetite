"use strict";

var Keyboard = (function(){
	
	var keyMapper = { //unfinished
		13 : "enter",
		16 : "shift",
		17 : "ctrl",
		18 : "alt",
		27 : "esc",
		32 : "space",
		37 : "left",
		38 : "up",
		39 : "right",
		40 : "down",
		49 : "one",
		50 : "two",
		51 : "three",
		52 : "four",
		53 : "five",
		65 : "six",
		67 : "seven",
		68 : "eight",
		69 : "nine",
		223 : "tilde" //192
	};
	
	var pressedKeys = {};
	var unhandledKeys = {};
	var handlers = {};
	
	document.addEventListener("keydown", function(e){
		var key = keyMapper[e.which];
		pressedKeys[key] = true;
		if(handlers[key]){
			handlers[key]();
		}else{
			unhandledKeys[key] = true;
		}
	}, true);
	
	document.addEventListener("keyup", function(e){
		var key = keyMapper[e.which];
		pressedKeys[key] = false;
		unhandledKeys[key] = false;
	}, true);
	
	function isAnyPressed(){
		for(var key in pressedKeys){
			if(pressedKeys[key]){
				return true;
			}
		}
		return false;
	}
	
	function register(key, handler){
		handlers[key] = handler;
	}
	
	return {
		pressedKeys: pressedKeys,
		unhandledKeys : unhandledKeys,
		isAnyKeyPressed: isAnyPressed,
		register : register
	};
})();