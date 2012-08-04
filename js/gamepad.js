var Gamepad = (function(){
	
	var findPads = setInterval(getPads, 500);
	var hasPads = false;
	var gamepads;
	var padMapper;
	
	function getHasPads(){
		return hasPads;
	};
	
	function getPadObject(){
		return gamepads;
	};
	
	function getPads(){
		gamepads = navigator.webkitGamepads || navigator.mozGamepads;
		if(gamepads[0]){
			clearInterval(findPads);
			hasPads = true;
		}
	}
	
	return {
		hasPads : getHasPads,
		getGamepads : getPadObject
	};
})();