window.addEventListener(
	'keydown',
	function(e){
		if(e.keyCode == 32){
			e.preventDefault();
		}
	}
	,true
); //Prevent Spacebar from paging down