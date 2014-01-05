"use strict";

var GAME_VERSION = "0.07a";

//SCREEN VARS
var Screen = {
	absPositionToRenderPosition : function(position){
		var x = position.x - (Camera.position.x - Screen.center.x);
		var y = position.y - (Camera.position.y - Screen.center.y);
		
		return { x: x, y: y};
	}
};

//PLAYER VARS
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

//ENEMY VARS
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

document.addEventListener("DOMContentLoaded",function(){
	var canvas = document.getElementById("cvsScreen");
	var map = World.newMap(500,500,16);
	engine.init(map);
	//document.getElementById("version").innerHTML = GAME_VERSION;
});

window.onresize = function(){
	renderer.initBuffer();
};