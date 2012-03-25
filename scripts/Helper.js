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
	
	function isHosted(){
		return window.location.href.indexOf('http') != -1 || window.location.href.indexOf('chrome-extension') != -1; 
	}
	
	return {
		random: random,
		assignProps: assignProps,
		isHosted: isHosted
	};
}();