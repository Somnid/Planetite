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
		192 : "tilde"
	};
	
	var pressedKeys = {};
	
	document.addEventListener("keydown", function(e){
		pressedKeys[keyMapper[e.which]] = true;
	}, true);
	
	document.addEventListener("keyup", function(e){
		pressedKeys[keyMapper[e.which]] = false;
	}, true);
	
	function isAnyPressed(){
		for(key in pressedKeys){
			if(pressedKeys[key]){
				return true;
			}
		}
		return false;
	}
	
	return {
		pressedKeys: pressedKeys,
		isAnyKeyPressed: isAnyPressed
	};
})();