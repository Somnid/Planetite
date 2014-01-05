"use strict";

var GAME_VERSION = "0.08";

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
var spider = new Actor(new Animator.animation({
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

var spiney = new Actor(new Animator.animation({
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

document.addEventListener("DOMContentLoaded",function(){
	var canvas = document.getElementById("cvsScreen");
	var map = World.newMap(500,500,16);
	var engine = Engine.create({
		map : map
	});
});

window.onresize = function(){
	renderer.initBuffer();
};