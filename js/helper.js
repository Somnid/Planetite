"use strict";

var Helper = function(){
	
	function random(max){
		return Math.floor(Math.random()*max);
	};
	
	return {
		random: random
	};
}();