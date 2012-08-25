var queryString = (function(){
	
	var cachedKeyVals;
	
	function parseUrl(url){
		var queryString;
		var hashString;
	
		if(url){
			var queryHash = url.split('?')[1];
			queryString = queryHash.split('#')[0];
			hashString = queryHash.split('#')[1];
		}else{
			queryString = window.location.search.substr(1);
			hashString = window.location.hash.substr(1);
		}
		
		var keyVals = {
			query : parseKeyVals(queryString),
			hash : parseKeyVals(hashString)
		};
		
		return keyVals;
	}
	
	function parseKeyVals(keyValString){
		if(keyValString == ""){ 
			return {};
		}
		
		var keyVals = {};
		var keyValSplit = keyValString.split("&");
		
		for(var i = 0;i < keyValSplit.length; i++){
			var split = keyValSplit[i].split("=");
			keyVals[split[0]] = split[1];
		}
		
		return keyVals;
	}
	
	function getQueryVal(name, encoded, url){
		return getDecodedVar(name, url, "query", encoded);
	}
	
	function getHashVal(name, encoded, url){
		return getDecodedVar(name, url, "hash", encoded);
	}
	
	function getVar(name, url, type){
		if(url){
			return parse(url)[type][name];
		}else{
			if(!cachedKeyVals || !cachedKeyVals[type][name]){ //If keyvals not cached or we don't find it in cache
				cachedKeyVals = parseUrl();
			}
			return cachedKeyVals[type][name];
		}
	}
	
	function getDecodedVar(name, url, type, encoded){
		var value = getVar(name, url, type);
		return encoded ? decodeURIComponent(value) : value;
	}
	
	//Gets the key value pairs for passed in querystring or defaults to window.location
	var getKeyVals = function(url){
		if(url){
			return parse(url);
		}
		
		return parse();
	};
	
	return {
		getQueryVal : getQueryVal,
		getHashVal : getHashVal,
		getKeyVals : getKeyVals
	};
})();

//TODO: Check for cache on getKeyVals