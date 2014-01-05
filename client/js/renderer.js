"use strict";
//DEPENDENCIES

var Renderer = (function(){

	function initBuffer(){
		Screen.canvas = this.canvas;
		Screen.webkitImageSmoothingEnabled = false;
		Screen.canvas.width = parseInt(document.defaultView.getComputedStyle(Screen.canvas).getPropertyValue("width").replace("px", ""));
		Screen.canvas.height = parseInt(document.defaultView.getComputedStyle(Screen.canvas).getPropertyValue("height").replace("px", ""));
		Screen.context = Screen.canvas.getContext("2d");
		
		Screen.buffer = document.createElement("canvas");
		Screen.buffer.width = Screen.canvas.width;
		Screen.buffer.height = Screen.canvas.height;
		Screen.bufferContext = Screen.buffer.getContext("2d");
		
		Screen.resolution = { x: Screen.canvas.width, y: Screen.canvas.height };
		Screen.center = { x: Screen.canvas.width/2, y: Screen.canvas.height/2};
	}

	function clearScreen(){
		Screen.bufferContext.fillStyle="#FFFFFF";
		Screen.bufferContext.fillRect(0, 0, Screen.resolution.x, Screen.resolution.y);
	}

	function drawHud(){
		//Hearts
		Screen.bufferContext.save();
		Screen.bufferContext.translate(Screen.resolution.x-(hudAsset.heart.width + 5),5);
		for(var i = 0; i < Player.hp; i++){
			Screen.bufferContext.drawImage(hudAsset.heart, 0, 0);
			Screen.bufferContext.translate(-(hudAsset.heart.width + 5),0);
		}
		Screen.bufferContext.restore();
		
		//Money
		Screen.bufferContext.save();
		Screen.bufferContext.translate(Screen.resolution.x - 15 - (12*(Player.money.toString()).length), 25);
		Screen.bufferContext.fillStyle = "#000000";
		Screen.bufferContext.font = "12px Arial";
		Screen.bufferContext.fillText("$"+Player.money, 0, 0);
		Screen.bufferContext.restore();
	}
	
	function drawTile(tileType, frameOffset, gridSize, x, y){
		Screen.bufferContext.drawImage(tileType, frameOffset, 0, gridSize, gridSize, x, y, gridSize, gridSize);
	}
	
	function drawSprite(sprite, renderPosition, flip, flipTranslate, currentFrame, frameOffset, framesetOffset){
		Screen.bufferContext.save();
		Screen.bufferContext.translate(renderPosition.x + flipTranslate + (currentFrame.offset.x * flip), renderPosition.y + currentFrame.offset.y)
		Screen.bufferContext.transform(flip, 0, 0, 1, 0, 0)
		Screen.bufferContext.drawImage(sprite, frameOffset, framesetOffset, currentFrame.frameWidth, currentFrame.frameHeight, 0, 0, currentFrame.frameWidth, currentFrame.frameHeight);
		Screen.bufferContext.restore();
	}
	
	function present(){
		Screen.context.drawImage(Screen.buffer, 0, 0);
	}
	
	function create(options){
		var renderer = {};
		renderer.canvas = options.canvas;
		
		renderer.initBuffer = initBuffer.bind(renderer);
		renderer.clearScreen = clearScreen.bind(renderer);
		renderer.drawHud = drawHud.bind(renderer);
		renderer.drawTile = drawTile.bind(renderer);
		renderer.drawSprite = drawSprite.bind(renderer);
		renderer.present = present.bind(renderer);
		
		return renderer;
	}
	
	return {
		create : create
	};

})();