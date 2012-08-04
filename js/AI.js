var AI = (function(){
	
	//none
	var none = function(){};
	
	//crawl
	var crawl = function(object, map){
		if(object.position.x < this.position.x && this.velocity.x > -this.speed && this.isGrounded(map)){
			this.velocity.x -= 2;
			this.isFacingRight = false;
		}else if(object.position.x > this.position.x && this.velocity.x < this.speed && this.isGrounded(map)){
			this.velocity.x += 2;
			this.isFacingRight = true;
		}
	}
	
	//clinger
	var clinger = function(object, map){
		var flip = this.isFacingRight ? 1 : -1;
		//On edge reverse direction
		if(this.getRight() >= map.getWidth() || (this.position.x <= 0)){
			this.isFacingRight = !this.isFacingRight;
		}
		
		if(this.isFacingRight && this.velocity.x < this.speed && this.isGrounded(map)){
			this.velocity.x += 2;
		}else if(!this.isFacingRight && this.velocity.x > -this.speed && this.isGrounded(map)){
			this.velocity.x -= 2;
		}
		
		if(!this.isGrounded(map)){
			if(this.isFacingRight && map.getTileAt(this.position.x - 1, this.getBottom()+1).isSolid
				|| !this.isFacingRight && map.getTileAt(this.getRight() + 1, this.getBottom()+1).isSolid){
				this.isAffectedByGravity = false;
				if(this.velocity.y < this.speed){
					this.velocity.y += 2;
					this.velocity.x = 0;
				}
			}else{
				this.isAffectedByGravity = true;
			}
		}
		
		if((map.getTileAt(this.getRight(), this.getBottom()-1).isSolid && this.isFacingRight)
			|| (map.getTileAt(this.position.x, this.getBottom()-1).isSolid && !this.isFacingRight)){
			this.isAffectedByGravity = false;
			if(this.velocity.y > -this.speed){
				this.velocity.y -= 2;
			}else if(this.velocity.y < -this.speed){
				this.velocity.y += Globals.gravity;
			}
			this.velocity.x += 2 * flip;
		}else{
			this.isAffectedbyGravity = true;
		}
	}
	
	
	return{
		none: none,
		crawl : crawl,
		clinger : clinger
	};
})();