var Audio = (function(){
	
	var context = new webkitAudioContext();
	var buffers = {};
	
	function onError(){
		alert("audio :(");
	}
	
	function getAudio(bufferName, url){
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function(){
			context.decodeAudioData(request.response, function(buffer){
				buffers[bufferName] = buffer;
			}, onError);
		}
		request.send();
	}
	
	function playBuffer(bufferName){
		var source = context.createBufferSource();
		source.buffer = buffers[bufferName];
		source.connect(context.destination);
		source.noteOn(0);
	}
	
	if(!Helper.isHosted()){
		console.log("Web Audio XHR not avaiable on local file system. Audio fails.");
		getAudio = function(){};
		playBuffer = function(){};
	}
	
	return{
		getAudio : getAudio,
		playBuffer : playBuffer
	};
})();