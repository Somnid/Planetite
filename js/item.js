var ItemType = {
	shovel : 1,
	pickaxe : 2,
	sword : 3,
	gun : 4,
	armor : 5
};

var Item = function(type, name, power){
	this.type = type;
	this.name = name;
	this.power = power;
	return this;
};

var Shovel = function(name, power){
	return Item.call(this, ItemType.shovel, name, power);
};

var Pickaxe = function(name, power){
	return Item.call(this, ItemType.pickaxe, name, power);
};

var Sword = function(name, power){
	return Item.call(this, ItemType.sword, name, power);
};

var Gun = function(name, power){
	return Item.call(this, ItemType.gun, name, power);
};

var Armor = function(name, power){
	return Item.call(this, ItemType.armor, name, power);
};