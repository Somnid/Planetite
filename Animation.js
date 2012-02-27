var Animator = (function(){

	var animation = function(frameMap, defaultFrameset){
		this._frameset = defaultFrameset || "idle";
		this.frame = 0;
		this.lastTick = 0;
		this.frameMap = frameMap;
		return this;
	};
	
	animation.prototype.frameset = function(frameset){
		if(typeof frameset == "string"){
			this.frame = this._frameset == frameset ? this.frame : 0;
			this._frameset = frameset;
		}
		
		return this._frameset;
	};
	
	animation.prototype.getCurrentFrameset = function(){
		return this.frameMap[this.frameset()];
	};
	
	animation.prototype.getCurrentFrame = function(){
		return this.getCurrentFrameset().frames[this.frame];
	};
	
	var frame = function(options){
		this.frameHeight = options.frameHeight;
		this.frameWidth = options.frameWidth;
		this.duration = options.duration;//miliseconds
		
		this.objectHeight = options.objectHeight || options.frameHeight;
		this.objectWidth = options.objectWidth || options.frameWidth;
		this.offset = { 
			x: options.offsetX || 0, 
			y: options.offsetY || 0
		}; 

		return this;
	};
	
	return {
		animation: animation,
		frame: frame
	};

})();