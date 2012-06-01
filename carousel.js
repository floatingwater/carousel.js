var Carousel = function(holder){
	this.holder = jQuery(holder);
	this.items  = this.holder.find('.b-carousel__item');
	this.width  = this.holder.innerWidth();
	this.itemWidth = 125;
	this._initButtons();
};
Carousel.prototype = {
	LENGTH: 5,
	ANIMATE_TIME: 1000,
	pushItems: function(newItems){
		this.items = jQuery.merge(this.items, newItems);
		var itemsHolder = this.holder.find('.b-carousel__items-holder');
		for(var i = 0; i < this.LENGTH; i++){
			itemsHolder.append(this.items[i]);
		}
		this.items  = this.holder.find('.b-carousel__item');
		this._initBlocks();
	},
	_initBlocks: function(){
		this.items.each((function(i, el){
			jQuery(el).css('left', i*this.itemWidth + 'px');
			console.log(i);
		}).bind(this));
	},
	_initButtons: function(){
		console.log(this);
		var prev = this.holder.find('.b-carousel__button_action_prev');
		var next = this.holder.find('.b-carousel__button_action_next');
		console.log('ololo');
		prev.bind('click', this._prev.bind(this));
		console.log('cont');
		next.bind('click', this._next.bind(this));
		console.log('cont2');
	},
	_next: function(){
		console.log('ohoh');
		this._move(1);
	},
	_prev: function(){
		this._move(-1);
	},
	_move: function(shift){
		this.items.animate({
			left: (shift < 0 ? '-=' : '+=') + Math.abs(this.itemWidth*shift),
		}, this.ANIMATE_TIME);
	}
};

(function(){
	var App = function(){
		this.carousel = new Carousel('.b-carousel');
		var items = this._getGallery();
		this.carousel.pushItems(items);
	}
	App.prototype = {
		_getGallery: function(){
			var items = new Array();
			for(var i = 0; i < 7; i++){
				var div = jQuery('<div class="b-carousel__item"></div>');
				div.css('background-image', 'url(img/'+i+'.jpg)');
				items.push(div);
			}
			return items;
		},
	}
	jQuery(function(){
		new App();
	});
}());
