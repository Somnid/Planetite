var Helper = function(){
	
	function random(max){
		return Math.floor(Math.random()*max);
	};
	
	function assignProps(assigneeObj, valueObj){
		for(key in assigneeObj){
			if(valueObj[key] != undefined && valueObj[key] != null){
				assigneeObj[key] = valueObj[key]
			}
		}
		
		return assigneeObj;
	}
	
	return {
		random: random,
		assignProps: assignProps
	};
}();