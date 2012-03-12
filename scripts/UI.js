$(document).ready(function(){
	UI.bindEvents();
	var map = World.newMap(100,100,16);
	Engine.init(map);
	$("#version").text(GAME_VERSION);
});

var UI = (function(){
	var firstSettingOpen = true;

	bindEvents = function(){
		//audio tab click
		$('#tab-audio').click(function(){
			var $settings = $('.settings-main')
			var $settingsAndAudio = $settings.add($('.settings-main audio'));
			if($settings.hasClass('slideout')){
				$settingsAndAudio.removeClass('slideout');
				$settingsAndAudio.addClass('slidein');
			}else{
				$settingsAndAudio.removeClass('slidein');
				$settingsAndAudio.addClass('slideout');
			}
		});
		//audio drag
		$('#content-audio').on('dragover', function(e){
			e.stopPropagation();
			e.preventDefault();
		});
		//audio drop
		$('#content-audio').on('drop', function(e){
			e.stopPropagation();
			e.preventDefault();
		
			e = e.originalEvent;
			files = e.dataTransfer.files;
			for(var i = 0; i < files.length; i++){
				var file = files[i];
				var reader = new FileReader();
				reader.onload = function(e){
					$('#content-audio').append('<audio controls><source src="' + e.target.result + '" type="audio/mp3" /></controls>');
				};
				reader.onerror = function(e){ console.log(e);};
				reader.readAsDataURL(file);
			}
		});
		$('.settings-main').on("webkitAnimationEnd", function(){
			if($('.settings-main').hasClass('slidein')){
				$('#content-audio audio').hide();
			}
		});
		$('.settings-main').on("webkitAnimationStart", function(){
			if($('.settings-main').hasClass('slideout')){
				$('#content-audio audio').show();
			}
		});
	};
	
	return {
		bindEvents: bindEvents
	};
})();