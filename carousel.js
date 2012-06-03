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
		this.firstI    = this.items.length - 1;
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
		this.lastI     = this.length;
		this.viewItems = jQuery(this.viewItems);//additional array for animation
	},
	_initButtons: function(){
		var prev = this.holder.find('.b-carousel__button_action_prev');
		var next = this.holder.find('.b-carousel__button_action_next');
		prev.bind('click', this._queue.bind(this, this.SHIFT));
		next.bind('click', this._queue.bind(this, -this.SHIFT));
	},
	_queue: (function(){
		var clicks  = [];
		var flag    = false;
		var dequeue = function(){
			clicks.splice(0,1);
			if(clicks.length === 0){
				flag = false;
			}else{
				this._move(clicks[0], dequeue.bind(this));
			}
		};
		return function(shift){
			if(!flag){
				log(this);
				this._move(shift, dequeue.bind(this));
				flag = true;
			}
			clicks.push(shift);
		}
	})(),
	_move: function(shift, callback){
		this.viewItems.animate({
			left: (shift < 0 ? '-=' : '+=') + Math.abs(this.viewShift*this.SHIFT),
		}, this.ANIMATE_TIME, this._changeItems.bind(this, shift, callback));
	},
	_changeItems: (function(){
		var i = 0;
		return function(shift, callback){
			i++;
			if(i === this.viewItems.length){
				i = 0;
				if(shift < 0){
					this.viewItems.first().remove();
					this.viewItems.splice(0, 1);
					var item   = this.viewItems.last();
					this.lastI = this.lastI == (this.items.length - 1) ? 0 : ++this.lastI;
					var newIt  = this.items[this.lastI];
					var left   = parseInt(item.css('left'));
					newIt.css('left', left + this.viewShift + 'px');
					this.itemsHolder.append(newIt);
					this.viewItems.push(newIt.get(0));
				}else{
					this.viewItems.last().remove();
					this.viewItems.splice(this.viewItems.length - 1, 1);
					var item   = this.viewItems.first();
					this.firstI = this.firstI === 0 ? this.items.length - 1 : --this.firstI;
					var newIt  = this.items[this.firstI];
					var left   = parseInt(item.css('left'));
					newIt.css('left', left - this.viewShift + 'px');
					this.itemsHolder.prepend(newIt);
					this.viewItems.push(newIt.get(0));
				}
				if(callback) callback();
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
			for(var i = 0; i < 10; i++){
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
