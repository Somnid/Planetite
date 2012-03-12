var World = (function(){
	var WORLD_VERSION = 0.001;
	
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
		this.frameTransitionHp = transitionHps || [];
		
		return this;
	};
	Tile.prototype.attack = function(damage){
		this.hp -= damage;
		
		if(this.frame < this.frameTransitionHp.length && this.maxHp - this.hp == this.frameTransitionHp[this.frame]){
			this.frame++;
		}
		
		if(this.hp <= 0){
			this.type = "null";
			this.isSolid = false;
		}
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
		
		this.getWidth = function(){
			return this.gridSize * this.gridWidth;
		};
		
		this.getHeight = function(){
			return this.gridSize * this.gridHeight;
		};
		
		this.loadTile = function(name, path){
			var tile = new Image();
			tile.src = "tiles/" + path;
			this.tiles[name] = tile;
		};
		
		this.draw = function(){
			for(var i = 0; i < this.grid.length; i++){
				for(var j = 0; j < this.grid[i].length; j++){
					var renderPosition = Screen.absPositionToRenderPosition({x: (i*this.gridSize), y: (j*this.gridSize) });
					var tile = this.grid[i][j]
					if(tile.type != "null"){
						Screen.context.drawImage(this.tiles[tile.type], tile.frame * this.gridSize, 0, this.gridSize, this.gridSize, renderPosition.x, renderPosition.y, this.gridSize, this.gridSize);
					}
				}
			}
		};
		
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
	
	var Map = function(width, height, size){
		this.tiles = {};
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
	
	function loadMap(save){
		if(save.version > WORLD_VERSION){
			alert("Operation Unsupported: Save version is greater than current version.");
		}
	
		var map = new Map();
		
		map.gridWidth = save.gridWidth;
		map.gridHeight = save.gridHeight;
		map.gridSize = save.gridSize;
		map.grid = makeGridFromSavedGrid(save.grid);
		map.width = map.gridWidth * map.gridSize;
		map.height = map.gridHeight * map.gridSize;
		
		return map;
	};
	
	function makeGridFromSavedGrid(grid){  //allows serialized grid object to reform as an object with functions
		var newGrid = new Array();
	
		for(var i = 0; i < grid.length; i++){
			newGrid[i] = new Array();
			for(var j = 0; j < grid[i].length; j++){
				savedGrid = grid[i][j];
				newGrid[i][j] = Helper.assignProps(new Tile(), savedGrid);
			}
		}
		
		return newGrid;
	}
	
	return {
		NullTile : NullTile,
		OBTile : OBTile,
		Tile : Tile,
		newMap : newMap,
		loadMap : loadMap
	};
})();