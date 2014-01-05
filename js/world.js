"use strict";

var World = (function(){
	var WORLD_VERSION = 0.06;
	
	function NullTile(){
		return new Tile("null", 0, false, 0);
	};
	
	function OBTile(){
		return new Tile("OB", 0, true, 0);
	};
	
	function Tile(type, frame, isSolid, hp, transitionHps){
		this.type = type;
		this.frame = frame;
		this.isSolid = isSolid;
		this.maxHp = hp;
		this.hp = hp;
		
		var frameTransitionHp = transitionHps || [];
		
		this.attack = function(damage){
			this.hp -= damage;
			
			if(this.frame < frameTransitionHp.length && this.maxHp - this.hp == frameTransitionHp[this.frame]){
				this.frame++;
			}
			
			if(this.hp <= 0){
				this.type = "null";
				this.isSolid = false;
			}
		};
		
		return this;
	};
	
	var MapProto = function(){
		this.getTileAt = function(x, y){
			var gx = Math.floor(x / this.gridSize);
			var gy = Math.floor(y / this.gridSize);
		
			if(gx > this.grid.length - 1 || gy > this.grid[gx].length - 1){
				return new OBTile();
			}
		
			return this.grid[gx][gy];
		};
		
		
		//USED?
		this.getWidth = function(){
			return this.gridSize * this.gridWidth;
		};
		//USED?
		this.getHeight = function(){
			return this.gridSize * this.gridHeight;
		};
		
		this.loadTile = function(name, path){
			var tile = new Image();
			tile.src = "tiles/" + path;
			this.tiles[name] = tile;
		};
		
		this.draw = function(){
			var clipBounds = this.getTileClipBounds();
			
			for(var i = clipBounds.xStart; i < clipBounds.xEnd; i++){
				for(var j = clipBounds.yStart; j < clipBounds.yEnd; j++){
					var renderPosition = Screen.absPositionToRenderPosition({x: (i*this.gridSize), y: (j*this.gridSize) });
					var tile = this.grid[i][j];
					if(tile.type != "null"){
						//Screen.context.drawImage(this.tiles[tile.type], tile.frame * this.gridSize, 0, this.gridSize, this.gridSize, renderPosition.x, renderPosition.y, this.gridSize, this.gridSize);
						renderer.drawTile(this.tiles[tile.type], tile.frame * this.gridSize, this.gridSize, renderPosition.x, renderPosition.y)
					}
				}
			}
		};
		
		this.getTileClipBounds = function(){
			return {
				xStart : Math.floor((Camera.position.x - Screen.center.x) / this.gridSize),
				xEnd : Math.ceil((Camera.position.x + Screen.center.x) / this.gridSize),
				yStart : Math.floor((Camera.position.y - Screen.center.y) / this.gridSize),
				yEnd : Math.ceil((Camera.position.y + Screen.center.y) / this.gridSize)
			};
		}
		
		this.save = function(){
			return JSON.stringify({
				grid : this.grid,
				gridWidth : this.gridWidth,
				gridHeight : this.gridHeight,
				gridSize : this.gridSize,
				version : WORLD_VERSION,
			});
		};
		
		return this;
	};
	
	var Map = function(width, height, size, chunkSize){
		this.tiles = {};
		this.grid = null;
		this.gridWidth = width;
		this.gridHeight = height;
		this.gridSize = size;
		this.grid = new Array();
		
		return this;
	};
	Map.prototype = new MapProto();
	
	function newMap(width, height, size){
		var map = new Map(width, height, size);
		
		for(var i = 0; i < map.gridWidth; i++){
			map.grid[i] = new Array();
			for(var j = 0; j < map.gridHeight; j++){
				if(i > 50 && i < 55 && j > 0 && j < 30){
					map.grid[i][j] = new NullTile();
				}else if(j > map.gridHeight / 3){
					var rnd = Helper.random(20);
					if(rnd < 1){
						map.grid[i][j] = new Tile("ore", 0, true, 5, [1,3]);
					}else if(rnd > 1 && rnd < 6){
						map.grid[i][j] = new Tile("rock", 0, true, 3, [1]);
					}else{
						map.grid[i][j] = new Tile("dirt", 0, true, 1);
					}
				}else{
					map.grid[i][j] = new NullTile();
				}
			}
		}
	
		map.width = map.gridWidth * map.gridSize;
		map.height = map.gridHeight * map.gridSize;
	
		return map;
	};
	
	return {
		NullTile : NullTile,
		OBTile : OBTile,
		Tile : Tile,
		newMap : newMap
	};
})();