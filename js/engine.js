//DEPENDENCIES: renderer

var engine = (function(){
	var lastTime = 0;
	var lastAnimationTick = 0;
	var isPaused = false;
	var isMenu = false;
	
	function initScreen (){
		lastTime = window.webkitAnimationStartTime;
		Screen.canvas = document.getElementById("cvsScreen");
		Screen.context = Screen.canvas.getContext("2d");
		Screen.resolution = { x: Screen.canvas.width, y: Screen.canvas.height };
		Screen.center = { x: Screen.canvas.width/2, y: Screen.canvas.height/2};
	}
	
	function togglePause(toggle){
		if(toggle != undefined){
			isPaused = toggle;
		}else{
			isPaused = !isPaused;
		}
	}

	function step(time){
		//fps timer
		var interval = time - lastTime;
		document.getElementById("fps").innerHTML = (Math.floor(1000 / interval));
		//document.getElementById("player-position").innerHTML = (Player.position.x + "x " + Player.position.y + "y");
		//document.getElementById("camera-position").innerHTML = (Camera.position.x + "x " + Camera.position.y + "y");
		//document.getElementById("frameset").innerHTML = (Player.animation.frameset());
		
		//get input		
		if(!isPaused){
			if(Player.hp > 0){
				getInput(time);
			}
			logicUpdates(time);
		}else{
			getMenuInput();
		}
		
		//clear
		Screen.context.fillStyle="#FFFFFF";
		Screen.context.fillRect(0, 0, Screen.resolution.x, Screen.resolution.y);
		
		//draw landscape
		engine.map.draw();
		
		//draw enemies
		for(var i = 0; i < Enemy.length; i++){
			Enemy[i].draw(time);
		}
		
		//draw sprite
		Player.draw(time);
		
		//draw Hud
		renderer.drawHud();
		
		//draw Menu
		if(isMenu){
			Menu.draw();
		}
		
		lastTime = time;
		
		if(isPaused) return;
		Compatibility.requestAnimationFrame(step, Screen.canvas);
	}
	
	function logicUpdates(time){				
		//velocity -> position updates
		Player.updatePosition(time, engine.map);
		
		for(var i = 0; i < Enemy.length; i++){
			var enemy = Enemy[i];
			enemy.updateAI(Player, engine.map);
			enemy.updatePosition(time, engine.map);
			if(enemy.alive && enemy.checkCollision(Player)){
				Player.attacked(1, enemy.isFacingRight);
			};
		}
		
		//animation update
		Player.updateAnimation(time);
		
		for(var i = 0; i < Enemy.length; i++){
			Enemy[i].updateAnimation(time);
		}
		
		if(Player.position.x - Screen.center.x >= 0 && Player.position.x + Screen.center.x < engine.map.width){
			Camera.position.x = Player.position.x;
		}
		if(Player.position.y - Screen.center.y >= 0 && Player.position.y + Screen.center.y < engine.map.height){
			Camera.position.y = Player.position.y;
		}
	}
	
	//TODO: move into it's own thing
	function sideDig(){
		for(var i = 0; Player.position.y - Map.gridSize + 1 + (i*Map.gridSize) < Player.getBottom(); i++){
			var x = Player.isFacingRight 
				? Player.getRight() + Map.gridSize - 1
				: Player.position.x - Map.gridSize + 1;
				
			var y = Player.position.y - Map.gridSize + 1 + (i*Map.gridSize);
			
			var tile = Map.getTileAt(x, y); 
			if(tile.type != "null"){
				tile.attack(Player.inventory.pickaxe.power);
				return;
			}
		}
	}
	
	function init(map){
		if(!Compatibility.requirementCheck()){
			alert("This browser does not meet the minimum requirements");
			return false;
		}
		
		initScreen();
		
		//REFACTOR into own resource loaded
		map.loadTile("black", "black.png");
		map.loadTile("dirt", "dirt.png");
		map.loadTile("green", "green.png");
		map.loadTile("red", "red.png");
		map.loadTile("rock", "rock.png");
		map.loadTile("ore", "ore.png");
		loadPlayer(map);
		loadCamera(map);
		loadEnemies(map);
		engine.map = map;
		//End REFACTOR
		
		Compatibility.requestAnimationFrame(step, Screen.canvas);
		
		//DEBUG
		document.addEventListener("keydown", function(e){
			document.getElementById("lastkey").innerHTML = e.keyCode;
		}, true);
		document.getElementById("btnSave").addEventListener("click", function(){
			console.log(engine.map.save());
		}, true);
		document.getElementById("btnLoad").addEventListener("click", function(){
		}, true);
		//END DEBUG
	}
	
	function getInput(time){
		if(Keyboard.pressedKeys.esc){
			togglePause();
			Keyboard.pressedKeys.esc = false;
		}
		if((Keyboard.pressedKeys.ctrl && Keyboard.pressedKeys.right) || (Keyboard.pressedKeys.ctrl && Keyboard.pressedKeys.left)){
			sideDig();
			Keyboard.pressedKeys.ctrl = false;
			Player.animation.frameset("pick");
			Player.animation.lastTick = time;
		}
		if(Keyboard.pressedKeys.down && Keyboard.pressedKeys.shift){
			Player.attack();
			Keyboard.pressedKeys.shift = false;
			Player.animation.frameset("crouch_sword");
			Player.animation.lastTick = time;
		}
		if(Keyboard.pressedKeys.ctrl){
			Map.getTileAt(Player.position.x + (Player.width / 2), Player.getBottom()+ Map.gridSize - 1, 0).attack(Player.inventory.shovel.power);
			Keyboard.pressedKeys.ctrl = false;
			Player.animation.frameset("dig");
			Player.animation.lastTick = time;
		}
		if(Keyboard.pressedKeys.shift && !Player.animation.getCurrentFrameset().noOverride){
			Player.attack();
			Keyboard.pressedKeys.shift = false;
			Player.animation.frameset("sword");
			Player.animation.lastTick = time;
		}
		if(Keyboard.pressedKeys.space && Player.isGrounded(engine.map)){
			Player.velocity.y -= 20;
			Keyboard.pressedKeys.space = false;
		}
		if(Keyboard.pressedKeys.left && !Player.animation.getCurrentFrameset().noOverride){
			if(Player.velocity.x > -Player.speed){
				Player.velocity.x -= 2;
			}
			Player.animation.frameset("walk");
			Player.isFacingRight = false;
		}
		if(Keyboard.pressedKeys.right && !Player.animation.getCurrentFrameset().noOverride){
			if(Player.velocity.x < Player.speed){
				Player.velocity.x += 2;
			}
			Player.animation.frameset("walk");
			Player.isFacingRight = true;
		}
		if(Keyboard.pressedKeys.up){
		}
		if(Keyboard.pressedKeys.down && !Player.animation.getCurrentFrameset().noOverride){
			Player.animation.frameset("crouch");
		}
		if(!Keyboard.isAnyKeyPressed() && !Player.animation.getCurrentFrameset().noOverride){
			Player.animation.frameset("idle");
		}
	}
	
	function getMenuInput(){
		if(Keyboard.pressedKeys.esc){
			togglePause();
			toggleMenu();
			Keyboard.pressedKeys.esc = false;
		}
		if(Keyboard.pressedKeys.down){
			Menu.selectNextOption();
			Keyboard.pressedKeys.down = false;
		}
		if(Keyboard.pressedKeys.up){
			Menu.selectPreviousOption();
			Keyboard.pressedKeys.up = false;
		}
	}
	
	return {
		init: init
	};
	
})();