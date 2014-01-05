"use strict";

var Menu = (function(){
	
	var height = 320;
	var width = 240;
	
	var Option = function(title, isSelected, func){
		this.title = title || "option";
		this.selectFunction = func || function(){};
		this.subOptions = null;
		this.isSelected = isSelected || false;
		return this;
	};
	
	Option.prototype.draw = function(x,y){
		Screen.context.save();
		Screen.context.translate(x, y);
		Screen.context.font = "30px Arial";
		Screen.context.fillStyle = this.isSelected ? "#FF0000" : "#FFFFFF";
		Screen.context.fillText(this.title, 0, 0);
		Screen.context.restore();
	};
	
	var Options = {
		draw: function(x, y){
			Screen.context.save();
			Screen.context.translate(x + 60, y + 30);
			for(var i = 0; i < this.options.length; i++){
				this.options[i].draw(0, 30 * i);
			}
			Screen.context.restore();
		},
		options: [
			new Option("option 1", true),
			new Option("option 2"),
			new Option("option 3")
		],
		getSelected: function(){
			var selectedItems = [];
			for(var i = 0; i < Options.options.length; i++){
				if(Options.options[i].isSelected){
					selectedItems.push(Options.options[i]);
				}
			}
			
			return selectedItems;
		},
		getSelectedIndexes: function(){
			var selectedIndexes = [];
			for(var i = 0; i < Options.options.length; i++){
				if(Options.options[i].isSelected){
					selectedIndexes.push(i);
				}
			}
			
			return selectedIndexes;
		},
		clearSelected: function(){
			for(var i = 0; i < Options.options.length; i++){
				Options.options[i].isSelected = false;
			}
		}
	};
	
	var selectedIndexes = function(index){
		if(index !== undefined && index < Options.options.length){
			Options.clearSelected();  //if we want multiple don't clear
			Options.options[index].isSelected = true;
		}
		return Options.getSelectedIndexes();
	};
	
	var selectNextOption = function(){
		if(selectedIndexes()[0] < Options.options.length - 1){
			selectedIndexes(selectedIndexes()[0]+1);
		}else{
			selectedIndexes(0);
		}
	}
	
	var selectPreviousOption = function(){
		if(selectedIndexes()[0] > 0){
			selectedIndexes(selectedIndexes()[0]-1);
		}else{
			selectedIndexes(Options.options.length - 1);
		}
	}
	
	var draw = function(){
		Screen.context.save();
		Screen.context.fillStyle = "rgba(170, 52, 221, 0.5)";
		Screen.context.fillRect((Screen.center.x - width/2), (Screen.center.y - height/2), width, height);
		Options.draw((Screen.center.x - width/2), (Screen.center.y - height/2));
		Screen.context.restore();
	};
	
	return {
		draw : draw,
		selectedIndexes : selectedIndexes,
		selectNextOption : selectNextOption,
		selectPreviousOption : selectPreviousOption
	};
	
})();