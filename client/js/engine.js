"use strict";

var Engine = (function(){
	function togglePause(toggle){
		if(toggle != undefined){
			this.isPaused = toggle;
		}else{
			this.isPaused = !this.isPaused;
		}
	}
	
	function toggleDebug(toggle){
		if(toggle != undefined){
			this.isDebug = toggle;
		}else{
			this.isDebug = !this.isDebug;
		}
	}

	function step(time){
		//fps timer
		var interval = time - this.lastTime;
		var fps = (Math.floor(1000 / interval)).toFixed(0);
		
		//get input
		if(!this.isPaused){
			if(Player.hp > 0){
				this.getInput(time);
			}
			this.logicUpdates(time);
		}else{
			this.getMenuInput();
		}
		
		this.renderer.clearScreen();
		this.map.draw(this.renderer);
		
		//draw enemies
		for(var i = 0; i < Enemy.length; i++){
			Enemy[i].draw(this.renderer, time);
		}
		
		//draw sprite
		Player.draw(this.renderer, time);
		
		//draw Hud
		this.renderer.drawHud();
		
		//draw Menu
		if(this.isMenu){
			Menu.draw();
		}
		//debug
		debuggerUtil.update({ 
			fps : fps,
			screenHeight : Screen.buffer.height,
			screenWidth : Screen.buffer.width
		});
		
		this.renderer.present();
		this.lastTime = time;
		
		if(this.isPaused) return;
		Compatibility.requestAnimationFrame(this.step, Screen.canvas);
	}
	
	function logicUpdates(time){
		//velocity -> position updates
		Player.updatePosition(time, this.map);
		
		for(var i = 0; i < Enemy.length; i++){
			var enemy = Enemy[i];
			enemy.updateAI(Player, this.map);
			enemy.updatePosition(time, this.map);
			if(enemy.alive && enemy.checkCollision(Player)){
				Player.attacked(1, enemy.isFacingRight);
			};
		}
		
		//animation update
		Player.updateAnimation(time);
		
		for(var i = 0; i < Enemy.length; i++){
			Enemy[i].updateAnimation(time);
		}
		
		if(Player.position.x - Screen.center.x >= 0 && Player.position.x + Screen.center.x < this.map.width){
			Camera.position.x = Player.position.x;
		}
		if(Player.position.y - Screen.center.y >= 0 && Player.position.y + Screen.center.y < this.map.height){
			Camera.position.y = Player.position.y;
		}
	}
	
	//TODO: move into it's own thing
	function sideDig(){
		for(var i = 0; Player.position.y - engine.map.gridSize + 1 + (i*engine.map.gridSize) < Player.getBottom(); i++){
			var x = Player.isFacingRight 
				? Player.getRight() + engine.map.gridSize - 1
				: Player.position.x - engine.map.gridSize + 1;
				
			var y = Player.position.y - engine.map.gridSize + 1 + (i*engine.map.gridSize);
			
			var tile = engine.map.getTileAt(x, y); 
			if(tile.type != "null"){
				tile.attack(Player.inventory.pickaxe.power);
				return;
			}
		}
	}
	
	function create(options){
		var engine = {};
		engine.lastTime = 0;
		engine.lastAnimationTick = 0;
		engine.isPaused = false;
		engine.isMenu = false;
		engine.isDebug = false;
		engine.renderer = options.renderer;
		
		engine.loadPlayer = loadPlayer.bind(engine);
		engine.loadCamera = loadCamera.bind(engine);
		engine.loadEnemies = loadEnemies.bind(engine);
		engine.getInput = getInput.bind(engine);
		engine.logicUpdates = logicUpdates.bind(engine);
		engine.step = step.bind(engine);
		engine.togglePause = togglePause.bind(engine);
		engine.toggleDebug = toggleDebug.bind(engine);
		
		engine.renderer.initBuffer();
		//REFACTOR into own resource loaded
		engine.map = options.map;
		engine.map.loadTile("black", "black.png");
		engine.map.loadTile("dirt", "dirt.png");
		engine.map.loadTile("green", "green.png");
		engine.map.loadTile("red", "red.png");
		engine.map.loadTile("rock", "rock.png");
		engine.map.loadTile("ore", "ore.png");
		engine.loadPlayer();
		engine.loadCamera();
		engine.loadEnemies();
		//End REFACTOR
		
		engine.lastTime = window.webkitAnimationStartTime;
		Compatibility.requestAnimationFrame(engine.step, Screen.canvas);
	}
	
	function getInput(time){
		var emptyPad = { buttons : [] };
		var Gamepad = navigator.webkitGetGamepads ? navigator.webkitGetGamepads()[0] ||  emptyPad : emptyPad 
	
		if(Keyboard.pressedKeys.esc){
			this.togglePause();
			Keyboard.pressedKeys.esc = false;
		}
		if(Keyboard.pressedKeys.tilde){
			//toggleDebug();
			debuggerUtil.show();
			Keyboard.pressedKeys.tilde = false;
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
			this.map.getTileAt(Player.position.x + (Player.width / 2), Player.getBottom()+ this.map.gridSize - 1, 0).attack(Player.inventory.shovel.power);
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
		if(Keyboard.pressedKeys.space && Player.isGrounded(this.map)){
			Player.velocity.y -= 20;
			Keyboard.pressedKeys.space = false;
		}
		if((Keyboard.pressedKeys.left || Gamepad.buttons[14])&& !Player.animation.getCurrentFrameset().noOverride){
			if(Player.velocity.x > -Player.speed){
				Player.velocity.x -= 2;
			}
			Player.animation.frameset("walk");
			Player.isFacingRight = false;
		}
		if((Keyboard.pressedKeys.right || Gamepad.buttons[14]) && !Player.animation.getCurrentFrameset().noOverride){
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
			this.togglePause();
			this.toggleMenu();
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
	
	function loadPlayer(){
		var sprite = new Image();
		sprite.src = "sprites/player.png"
		Player.sprite = sprite;
		
		Player.position.x = this.map.width / 2;
		Player.position.y = this.map.height / 4;
		Player.width = 16;
		Player.height = 32;
	}

	function loadEnemies(){
		var sprite = new Image();
		sprite.src = "sprites/spider.png"
		Enemy[0].sprite = sprite;
	
		Enemy[0].position.x = this.map.width * 0.75;
		Enemy[0].position.y = this.map.height * 0.25;
		Enemy[0].width = 23;
		Enemy[0].height = 10;
	
		var sprite2 = new Image();
		sprite2.src = "sprites/spiney.png"
		Enemy[1].sprite = sprite2;
	
		Enemy[1].position.x = this.map.width * 0.25;
		Enemy[1].position.y = this.map.height * 0.25;
		Enemy[1].width = 19;
		Enemy[1].height = 10;
	}

	function loadCamera(){
		Camera.position.x = this.map.width / 2;
		Camera.position.y = this.map.height / 2;
	}
	
	return {
		create : create
	};
	
})();