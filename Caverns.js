var GAME_VERSION = "0.06";

var Screen = {
	absPositionToRenderPosition : function(position){
		var x = position.x - (Camera.position.x - Screen.center.x);
		var y = position.y - (Camera.position.y - Screen.center.y);
		
		return { x: x, y: y};
	}
};

var Player = new PlayerObject(new Animator.animation({
	"idle" : {
		frames: [new Animator.frame({frameHeight: 32, frameWidth: 16, duration: 142})],
		home: "idle",
		index: 0,
		noOverride: false
	},
	"dig" : {
		frames: [new Animator.frame({frameHeight: 32, frameWidth: 16, duration: 142})],
		home: "idle",
		index: 1,
		noOverride: true
	}, 
	"walk" : {
		frames: [new Animator.frame({frameHeight: 32, frameWidth: 16, duration: 142}),
		 new Animator.frame({frameHeight: 32, frameWidth: 16, duration: 142})],
		home: "walk",
		index: 2,
		noOverride: false
	},
	"pick" : {
		frames: [new Animator.frame({frameHeight: 39, frameWidth: 19, duration: 142, offsetX: 0, offsetY: -7}),
		 new Animator.frame({frameHeight: 39, frameWidth: 27, duration: 142, offsetX: 0, offsetY: -7})],
		home: "idle",
		index: 3,
		noOverride: true
	},
	"sword" : {
		frames: [new Animator.frame({frameHeight: 46, frameWidth: 19, duration: 70, offsetX: 0, offsetY: -14, objectWidth: 18}),
		 new Animator.frame({frameHeight: 46, frameWidth: 30, duration: 70, offsetX: 0, offsetY: -14, objectWidth: 19}),
		 new Animator.frame({frameHeight: 46, frameWidth: 34, duration: 70, offsetX: 0, offsetY: -14, objectwidth: 19})],
		home: "idle",
		index: 4,
		noOverride: true
	},
	"crouch" : {
		frames: [new Animator.frame({frameHeight: 23, frameWidth: 16, duration: 142, offsetY: 9})],
		home: "crouch",
		index: 5,
		noOverride: false
	}, 
	"crouch_sword" : {
		frames: [new Animator.frame({frameHeight: 37, frameWidth: 15, duration: 70, offsetX: 0, offsetY: -5}),
		 new Animator.frame({frameHeight: 37, frameWidth: 28, duration: 70, offsetX: 0, offsetY: -5}),
		 new Animator.frame({frameHeight: 37, frameWidth: 33, duration: 70, offsetX: 0, offsetY: -5})],
		home: "crouch",
		index: 6,
		noOverride: true
	},
	"dead" : {
		frames: [new Animator.frame({frameHeight: 12, frameWidth: 32, duration: 142, offsetY: 20})],
		home: "dead",
		index: 7,
		noOverride: true
	}
}),3,3);

//Enemies Initilization

var spider = new Object(new Animator.animation({
				"idle" : {
					frames: [new Animator.frame({frameHeight: 10, frameWidth: 23, duration: 142}),
					new Animator.frame({frameHeight: 10, frameWidth: 15, duration: 142, offsetX: 4, offsetY: 0})],
					home: "idle",
					index: 0,
					noOverride: false
				},
				"dead" : {
					frames: [new Animator.frame({frameHeight: 7, frameWidth: 28, duration: 142, offsetY: 3})],
					home: "dead",
					index: 1,
					noOverride: true
				}
			}),3, 1, AI.crawl);

var spiney = new Object(new Animator.animation({
				"idle" : {
					frames: [new Animator.frame({frameHeight: 10, frameWidth: 19, duration: 142}),
					new Animator.frame({frameHeight: 10, frameWidth: 19, duration: 142})],
					home: "idle",
					index: 0,
					noOverride: false
				},
				"dead" : {
					frames: [new Animator.frame({frameHeight: 7, frameWidth: 22, duration: 142, offsetY: 3})],
					home: "dead",
					index: 1,
					noOverride: true
				}
			}),3, 1, AI.clinger);


var Enemy = [spider, spiney];

var Camera = {
	position: { x:0, y:0}
};

var Engine = (function(){
	var lastTime = 0;
	var lastAnimationTick = 0;
	var isPaused = false;
	var isMenu = false;
	
	var initScreen = function(){
		lastTime = window.webkitAnimationStartTime;
		Screen.canvas = document.getElementById("cvsScreen");
		Screen.context = Screen.canvas.getContext("2d");
		Screen.resolution = { x: Screen.canvas.width, y: Screen.canvas.height };
		Screen.center = { x: Screen.canvas.width/2, y: Screen.canvas.height/2};
	};
	
	var togglePause = function(toggle){
		if(toggle != undefined){
			isPaused = toggle;
		}else{
			isPaused = !isPaused;
		}
	}
	
	var toggleMenu = function(toggle){
		if(toggle != undefined){
			isMenu = toggle;
		}else{
			isMenu = !isMenu;
		}
	}
	
	var step = function (time){
		//fps timer
		var interval = time - lastTime;
		$("#fps").text(Math.floor(1000 / interval));
		$("#player-position").text(Player.position.x + "x " + Player.position.y + "y");
		$("#camera-position").text(Camera.position.x + "x " + Camera.position.y + "y");
		$("#frameset").text(Player.animation.frameset());
		
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
		Engine.map.draw();
		
		//draw enemies
		for(var i = 0; i < Enemy.length; i++){
			Enemy[i].draw(time);
		}
		
		//draw sprite
		Player.draw(time);
		
		//draw Hud
		drawHud();
		
		//draw Menu
		if(isMenu){
			Menu.draw();
		}
		
		lastTime = time;
		Compatibility.requestAnimationFrame(step, Screen.canvas);
	};
	
	var logicUpdates = function(time){				
		//velocity -> position updates
		Player.updatePosition(time, Engine.map);
		
		for(var i = 0; i < Enemy.length; i++){
			var enemy = Enemy[i];
			enemy.updateAI(Player, Engine.map);
			enemy.updatePosition(time, Engine.map);
			if(enemy.alive && enemy.checkCollision(Player)){
				Player.attacked(1, enemy.isFacingRight);
			};
		}
		
		//animation update
		Player.updateAnimation(time);
		
		for(var i = 0; i < Enemy.length; i++){
			Enemy[i].updateAnimation(time);
		}
		
		if(Player.position.x - Screen.center.x >= 0 && Player.position.x + Screen.center.x < Engine.map.width){
			Camera.position.x = Player.position.x;
		}
		if(Player.position.y - Screen.center.y >= 0 && Player.position.y + Screen.center.y < Engine.map.height){
			Camera.position.y = Player.position.y;
		}
	}
	
	var drawHud = function(){
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
	};
	
	var sideDig = function(){
		for(var i = 0; Player.position.y - Engine.map.gridSize + 1 + (i*Engine.map.gridSize) < Player.getBottom(); i++){
			var x = Player.isFacingRight 
				? Player.getRight() + Engine.map.gridSize - 1
				: Player.position.x - Engine.map.gridSize + 1;
				
			var y = Player.position.y - Engine.map.gridSize + 1 + (i*Engine.map.gridSize);
			
			var tile = Engine.map.getTileAt(x, y); 
			if(tile.type != "null"){
				tile.attack(Player.inventory.pickaxe.power);
				return;
			}
		}
	};
	
	var attack = function(){
		var length = 20;
		var leftEdge;
		var rightEdge;
		var topEdge = Player.position.y;
		var bottomEdge = Player.getBottom();
		if(Player.isFacingRight){
			leftEdge = Player.getRight();
			rightEdge = Player.getRight() + length;
		}else{
			leftEdge = Player.position.x - length;
			rightEdge = Player.position.x;
		}
		
		for(var i = 0; i < Enemy.length; i++){
			var enemy = Enemy[i];
			if(((enemy.position.x > leftEdge && enemy.position.x < rightEdge)
					|| (enemy.getRight() > leftEdge && enemy.getRight() < rightEdge))
				&& (enemy.position.y > topEdge && enemy.position.y < bottomEdge)
					|| (enemy.getBottom() > topEdge && enemy.getBottom() < bottomEdge)){
						enemy.attacked(Player.inventory.sword.power, Player.isFacingRight);
			}
		}
	}
	
	var init = function(map){
		if(!Compatibility.requirementCheck()){
			alert("This browser does not meet the minimum requirements");
			return false;
		}
		
		worldInit(map);
		
		Compatibility.requestAnimationFrame(step, Screen.canvas);
		
		$(document).keydown(function(e){
			$("#lastkey").text(e.keyCode);
		});
		$("#btnSave").click(function(){
			localStorage.setItem("save", Engine.map.save());
		});
		$("#btnLoad").click(function(){
			var saveString = localStorage.getItem("save");
			var saveObj;
			
			if(saveString && saveString != ""){
				saveObj = JSON.parse(saveString);
			}
			
			worldInit(World.loadMap(saveObj));
		});
	}
	
	var worldInit = function(map){
		initScreen();
		
		map.loadTile("black", "black.png");
		map.loadTile("dirt", "dirt.png");
		map.loadTile("green", "green.png");
		map.loadTile("red", "red.png");
		map.loadTile("rock", "rock.png");
		map.loadTile("ore", "ore.png");
		loadPlayer(map);
		loadCamera(map);
		loadEnemies(map);
		Engine.map = map;
	};
	
	var getInput = function(time){
		if(Keyboard.pressedKeys.esc){
			togglePause();
			toggleMenu();
			Keyboard.pressedKeys.esc = false;
		}
		if((Keyboard.pressedKeys.ctrl && Keyboard.pressedKeys.right) || (Keyboard.pressedKeys.ctrl && Keyboard.pressedKeys.left)){
			sideDig();
			Keyboard.pressedKeys.ctrl = false;
			Player.animation.frameset("pick");
			Player.animation.lastTick = time;
		}
		if(Keyboard.pressedKeys.down && Keyboard.pressedKeys.shift){
			attack();
			Keyboard.pressedKeys.shift = false;
			Player.animation.frameset("crouch_sword");
			Player.animation.lastTick = time;
		}
		if(Keyboard.pressedKeys.ctrl){
			Engine.map.getTileAt(Player.position.x + (Player.width / 2), Player.getBottom()+ Engine.map.gridSize - 1, 0).attack(Player.inventory.shovel.power);
			Keyboard.pressedKeys.ctrl = false;
			Player.animation.frameset("dig");
			Player.animation.lastTick = time;
		}
		if(Keyboard.pressedKeys.shift && !Player.animation.getCurrentFrameset().noOverride){
			attack();
			Keyboard.pressedKeys.shift = false;
			Player.animation.frameset("sword");
			Player.animation.lastTick = time;
		}
		if(Keyboard.pressedKeys.space && Player.isGrounded(Engine.map)){
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
	};
	
	getMenuInput = function(){
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
	};
	
	return {
		init: init
	};
	
})();

var hudAsset = (function(){
	var heart = new Image();
	heart.src = "sprites/heart.png"
	
	return {
		heart: heart
	};
})();

function loadPlayer(map){
	var sprite = new Image();
	sprite.src = "sprites/player.png"
	Player.sprite = sprite;
	
	Player.position.x = map.width / 2;
	Player.position.y = map.height / 4;
	Player.width = 16;
	Player.height = 32;
}

function loadEnemies(map){
	var sprite = new Image();
	sprite.src = "sprites/spider.png"
	Enemy[0].sprite = sprite;
	
	Enemy[0].position.x = map.width * 0.75;
	Enemy[0].position.y = map.height * 0.25;
	Enemy[0].width = 23;
	Enemy[0].height = 10;
	
	var sprite2 = new Image();
	sprite2.src = "sprites/spiney.png"
	Enemy[1].sprite = sprite2;
	
	Enemy[1].position.x = map.width * 0.25;
	Enemy[1].position.y = map.height * 0.25;
	Enemy[1].width = 19;
	Enemy[1].height = 10;
}

function loadCamera(map){
	Camera.position.x = map.width / 2;
	Camera.position.y = map.height / 2;
}

$(document).ready(function(){
	var map = World.newMap(60,40,16);
	Engine.init(map);
	$("#version").text(GAME_VERSION);
});