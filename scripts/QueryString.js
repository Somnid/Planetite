var QueryString = (function(){
	
	var cachedKeyVals;
	
	var parse = function(queryString){
		if(queryString == null || queryString == undefined){
			queryString =  window.location.search.substr(1);
		}else{
			queryString = queryString.split('?')[1];
		}
		if(queryString == "" || queryString == null || queryString == undefined) return {};
		
		keyvalSplit = queryString.split("&");
		var keyvals = {};
		for(var i = 0;i < keyvalSplit.length; i++){
			var split = keyvalSplit[i].split("=");
			keyvals[split[0]] = split[1];
		}
		
		return keyvals;
	};
	
	var getVar = function(name, queryString){
		if(queryString){
			return parse(queryString)[name];
		}else{
			if(!cachedKeyVals || !cachedKeyVals[name]){ //If keyvals not cached or we don't find it in cache
				cachedKeyVals = parse();
			}
		
			return cachedKeyVals[name];
		}
	};
	
	//Gets the key value pairs for passed in querystring or defaults to window.location
	var getKeyVals = function(queryString){
		if(queryString){
			return parse(queryString);
		}
		
		return cachedKeyVals;
	};
	
	return {
		getVar : getVar,
		getKeyVals : getKeyVals
	};
})();