"use strict";

var debuggerUtil = (function(){
	
	var debugWindow = null;
	var parent = null;
	var isDebug = false;
	
	function show(){
		debugWindow = window.open("debug.html#parent=" + encodeURIComponent(window.location.origin), "", "width=320,height=240,location=no,menubar=no,titlebar=no");
		isDebug = true;
	}
	
	function close(){
		debugWindow.close()
		isDebug = false;
	}
	
	function toggle(show){
		var show = show || isDebug;
		if(show){
			close();
		}else{
			show();
		}
	}
	
	function update(updateObject){
		postMessage(updateObject);
	}
	
	function postMessage(object){
		if(!debugWindow){
			return;
		}
		debugWindow.postMessage(object, "*");
	}
	
	function receiveMessage(e){
		if(e.origin !== parent){
			console.warn("recieved unsafe message from: " + e.origin);
			return;
		}
		
		var output = document.getElementById("content");
		output.innerHTML = "";
		for(var key in e.data){
			var element = document.createElement("p");
			var text = document.createTextNode(key + ": " + e.data[key]);
			element.appendChild(text);
			output.appendChild(element);
		}
	}
	
	function getParent(){
		parent = queryString.getHashVal("parent", true);
	}
	
	if(window.location.href.indexOf("debug.html") != -1){
		window.addEventListener("message", receiveMessage, false);
	}
	
	getParent();
	
	return {
		show : show,
		close : close,
		toggle : toggle,
		update : update
	};
	
})();