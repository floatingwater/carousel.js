log = console.log;

var Carousel = function(holder, items){
	this.holder    = jQuery(holder);
	this.items     = jQuery(items);
	this.viewItems = [];
	this._initBlocks();
	this._initButtons();
};
Carousel.prototype = {
	//constants
	SHIFT: 1,
	ANIMATE_TIME: 500,
	TEMPLATES: {
		itemsHolder: '<div class="b-carousel__items-holder"></div>',
		prevButt: '<button class="b-carousel__button '+
		          'b-carousel__button_action_prev">Prev</button>',
		nextButt: '<button class="b-carousel__button '+
		          'b-carousel__button_action_next">Next</button>'
	},
	//private methods
	_initBlocks: function(){
		this.itemsHolder = jQuery(this.TEMPLATES.itemsHolder);
		this.prevButt    = jQuery(this.TEMPLATES.prevButt);
		this.nextButt    = jQuery(this.TEMPLATES.nextButt);
		this.holder.append(this.prevButt)
		           .append(this.itemsHolder)
		           .append(this.nextButt);
		this._setBlocks();
	},
	_setBlocks: function(){
		var item       = this.items[this.items.length - 1];
		this.itemsHolder.append(item);
		this.viewItems.push(item.get(0));
		var width      = item.width();
		var marginL    = parseInt(item.css('marginLeft'));
		var marginR    = parseInt(item.css('marginRight'));
		var outerWidth = width + marginL + marginR;
		var itHolWidth = this.itemsHolder.width();
		this.length    = Math.floor(itHolWidth/outerWidth);
		var blocks     = outerWidth * this.length - marginR;//last block margin-right
		var margin     = Math.round((itHolWidth-blocks)/(this.length-1));
		this.viewShift     = outerWidth + margin;
		item.css('left',  '-' + this.viewShift + 'px');
		for(var i = 0; i <= this.length; i++){
			var el   = this.items[i];
			var left = i*this.viewShift ;
			el.css('left', left + 'px');
			this.itemsHolder.append(el);
			this.viewItems.push(el.get(0));
		}
		this.viewItems = jQuery(this.viewItems);
	},
	_initButtons: function(){
		var prev = this.holder.find('.b-carousel__button_action_prev');
		var next = this.holder.find('.b-carousel__button_action_next');
		prev.bind('click', this._prev.bind(this));
		next.bind('click', this._next.bind(this));
	},
	_next: function(){
		this._move(-1);
	},
	_prev: function(){
		this._move(1);
	},
	_move: function(shift){
		this.viewItems.animate({
			left: (shift < 0 ? '-=' : '+=') + Math.abs(this.viewShift*this.SHIFT),
		}, this.ANIMATE_TIME, this._changeItems.bind(this, shift));
		log('now');
	},
	_changeItems: (function(){
		var i = 0;
		return function(shift){
			i++;
			log(i);
			if(i === this.viewItems.length){
				i = 0;
				
			}
		};
	})()
};

(function(){
	var App = function(){
		var items = this._getGallery();
		this.carousel = new Carousel('.b-carousel', items);
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
