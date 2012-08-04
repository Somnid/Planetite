//DEPENDENCIES

var renderer = (function(){

	function drawHud(){
		//Hearts
		Screen.context.save();
		Screen.context.translate(Screen.resolution.x-(hudAsset.heart.width + 5),5);
		for(var i = 0; i < Player.hp; i++){
			Screen.context.drawImage(hudAsset.heart, 0, 0);
			Screen.context.translate(-(hudAsset.heart.width + 5),0);
		}
		Screen.context.restore();
		
		//Money
		Screen.context.save();
		Screen.context.translate(Screen.resolution.x - 15 - (12*(""+Player.money).length), 25);
		Screen.context.fillStyle = "#000000";
		Screen.context.font = "12px Arial";
		Screen.context.fillText("$"+Player.money, 0, 0);
		Screen.context.restore();
	}

	return {
		drawHud : drawHud
	};

})();