var Soundtrack = (function(){
	
	var isPlaying = false;
	var playIndex = 0;
	var audioSelector = '#content-audio audio';
	
	function advanceIndex(){
		if(playIndex >= $(audioSelector).length - 1){
			playIndex = 0;
		}else{
			playIndex++;
		}
		playAtIndex();
	};
	
	function playAtIndex(){
		var audioElement = $(audioSelector)[playIndex];
		audioElement.play();
		isPlaying = true;
	};
	
	function playSet(){
		if(!isPlaying){
			playAtIndex();
		}
	};
	
	function pauseSet(){
	};
	
	function error(){
		alert("Error playing audio file. May be incompatible with this browser.");
	};
	
	return {
		playSet : playSet,
		pauseSet : pauseSet,
		isPlaying : isPlaying,
		advanceIndex: advanceIndex,
		error : error
	};
})();