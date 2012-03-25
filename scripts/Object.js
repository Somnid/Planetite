var Object = function(animation, hp, speed, aiFunc){
	this.position = { x:0, y: 0};
	this.sprite = null;
	this.animation = animation;
	this.isFacingRight = true;
	this.velocity = {x: 0, y: 0};
	this.hp = hp;
	this.speed = speed || 0;
	this.aiFunc = aiFunc || function(){};
	this.isAffectedByGravity = true;
	this.alive = true;
	return this;
};

Object.prototype.getRight = function(){
	return this.position.x + this.width;
};

Object.prototype.getBottom = function(){
	return this.position.y + this.height;
};

Object.prototype.isGrounded = function(map){
	var yToTest = this.getBottom() + 1;
	return map.getTileAt(this.position.x+1, yToTest).isSolid || map.getTileAt(this.getRight()-1, yToTest).isSolid;
};

Object.prototype.checkCollision = function(object){	
	if(((object.position.x >= this.position.x && object.position.x <= this.getRight())
			|| (object.getRight() >= this.position.x && object.getRight() <= this.getRight()))
		&& ((object.position.y >= this.position.y && object.position.y <= this.getBottom())
			|| (object.getBottom() >= this.position.y && object.getBottom() <= this.getBottom())))
	{
		return true;
	}
	
	return false;
};

Object.prototype.attacked = function(damage, isRightSide){
	var flip = isRightSide ? 1: -1;
	this.hp -= damage;
	this.velocity.x += 10 * flip;
	this.velocity.y += -10;
	if(this.hp <= 0){
		this.animation.frameset("dead");
		this.aiFunc = AI.none;
		this.isAffectedByGravity = true;
		this.alive = false;
	}
};

Object.prototype.draw = function(){
	var renderPosition = Screen.absPositionToRenderPosition(this.position);
	var flip = this.isFacingRight ? 1 : -1;
	var flipTranslate = this.isFacingRight ? 0 : this.width;
	
	var currentFrameSet = this.animation.frameMap[this.animation.frameset()];
	var currentFrame = this.animation.frameMap[this.animation.frameset()].frames[this.animation.frame];
	
	function getFramesetOffset(frameset){
		var offset = 0;
		for(var key in this.animation.frameMap){
			if(key != frameset){
				offset += this.animation.frameMap[key].frames[0].frameHeight;
			}else{
				return offset;
			}
		}
		return offset;
	}
	
	function getFrameOffset(frame){
		var offset = 0;
		for(var i = 0; i < frame; i++){
			offset += currentFrameSet.frames[i].frameWidth;
		}
		return offset;
	}
	
	var framesetOffset = getFramesetOffset.call(this, this.animation.frameset());
	var frameOffset = getFrameOffset.call(this, this.animation.frame);
	
	Screen.context.save();
	Screen.context.translate(renderPosition.x + flipTranslate + (currentFrame.offset.x * flip), renderPosition.y + currentFrame.offset.y)
	Screen.context.transform(flip, 0, 0, 1, 0, 0)
	Screen.context.drawImage(this.sprite, frameOffset, framesetOffset, currentFrame.frameWidth, currentFrame.frameHeight, 0, 0, currentFrame.frameWidth, currentFrame.frameHeight);
	Screen.context.restore();
};

Object.prototype.updatePosition = function(time, map){
	var i = 0;
	
	//Gravity
	if(this.isAffectedByGravity){
		this.velocity.y += Globals.gravity;
	}
	
	//update Y
	if(this.velocity.y > 0){
		do{
			var yToTest = this.getBottom() + i;
			if(yToTest >= map.getHeight()
			|| map.getTileAt(this.position.x+1, yToTest).isSolid
			|| map.getTileAt(this.getRight()-1, yToTest).isSolid){
				this.position.y = (Math.floor(yToTest / map.gridSize) * map.gridSize) - this.height;
				this.velocity.y = 0;
				break;
			}      
			
			if(i == this.velocity.y){
				break;
			}else if(i + map.gridSize > this.velocity.y){
				i = this.velocity.y;
			}else{
				i += map.gridSize;
			}
		}while(i <= this.velocity.y)
	}else if(this.velocity.y < 0){
		do{
			var yToTest = this.position.y + i;
			if(yToTest <= 0
			|| map.getTileAt(this.position.x+1, yToTest).isSolid
			|| map.getTileAt(this.getRight()-1, yToTest).isSolid){
				this.position.y = (Math.floor(yToTest / map.gridSize) * map.gridSize) + map.gridSize;
				this.velocity.y = 0;
				break;
			}      
			
			if(i == this.velocity.y){
				break;
			}else if(i - map.gridSize < this.velocity.y){
				i = this.velocity.y;
			}else{
				i -= map.gridSize;
			}
		}while(i >= this.velocity.y)
	}
	
	this.position.y +=this.velocity.y;
	
	//update X
	var j = 0;
	if(this.velocity.x > 0){
		do{
			var xToTest = this.getRight() + j;
			if(xToTest >= map.getWidth()
			|| map.getTileAt(xToTest, this.getBottom()-1).isSolid
			|| map.getTileAt(xToTest, this.position.y+1).isSolid){
				this.position.x = (Math.floor(xToTest / map.gridSize) * map.gridSize) - this.width;
				this.velocity.x = 0;
				break;
			}      
			
			if(j == this.velocity.x){
				break;
			}else if(i + map.gridSize > this.velocity.x){
				j = this.velocity.x;
			}else{
				j += map.gridSize;
			}
		}while(j <= this.velocity.x)
	}else if(this.velocity.x < 0){
		do{
			var xToTest = this.position.x + j;
			if(xToTest <= 0){
				this.position.x = 0;
				this.velocity.x = 0;
				break;
			}
			if(map.getTileAt(xToTest, this.position.y+1).isSolid
			|| map.getTileAt(xToTest, this.getBottom()-1).isSolid){
				this.position.x = (Math.floor(xToTest / map.gridSize) * map.gridSize) + map.gridSize - 1;
				this.velocity.x = 0;
				break;
			}      
			
			if(j == this.velocity.x){
				break;
			}else if(j - map.gridSize < this.velocity.x){
				j = this.velocity.x;
			}else{
				j -= map.gridSize;
			}
		}while(i >= this.velocity.x)
	}
	
	this.position.x += this.velocity.x;
	
	//friction
	var oldVelocity = this.velocity.x;
	
	if(this.velocity.x > 0 && this.isGrounded(map)){
		this.velocity.x -= 1;
	}
	
	if(this.velocity.x < 0 && this.isGrounded(map)){
		this.velocity.x += 1;
	}
	
	//if the sign flipped during friction calculation then stabilize
	if(oldVelocity * this.velocity.x < 0){
		this.velocity.x = 0;
	}
};

Object.prototype.updateAnimation = function(time){
	var frameDuration = this.animation.getCurrentFrame().duration;
	if(this.animation.lastTick + frameDuration < time){  //7fps
		var frameMap = this.animation.frameMap[this.animation.frameset()];
		if(this.animation.frame + 1 == frameMap.frames.length){
			this.animation.frameset(frameMap.home);
			this.animation.frame = 0;
		}else{
			this.animation.frame++;
		}
		this.animation.lastTick = time;
	}
};

Object.prototype.updateAI = function(target, map){
	this.aiFunc.call(this, target, map);
};

//Player Subclass
var PlayerObject = function(){
	this.money = 0;
	this.inventory = {
		shovel : new Shovel("Bronze Alloy Shovel", 1),
		pickaxe : new Pickaxe("Bronze Alloy Pickaxe", 1),
		sword : new Sword("Bronze Alloy Sword", 1),
		armor : new Armor("Ratty Spacesuit", 0)
	};
	return Object.apply(this, arguments);
};

PlayerObject.prototype = new Object();

PlayerObject.prototype.attacked = function(damage, isRightSide){
	if(this.hp > 0){
		var flip = isRightSide ? 1: -1;
		this.hp -= damage;
		this.velocity.x += 10 * flip;
		this.velocity.y += -10;
		AudioPlayer.playBuffer("hurt");
		if(this.hp <= 0){
			this.animation.frameset("dead");
			this.aiFunc = AI.none;
			this.isAffectedByGravity = true;
			this.alive = false;
		}
	}
};