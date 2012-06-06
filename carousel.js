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
		var marginR    = parseInt(item.css('marginRight'));
		var outerWidth = item.outerWidth(true);
		var itHolWidth = this.itemsHolder.width();
		this.length    = Math.floor(itHolWidth/outerWidth);
		var blocks     = outerWidth * this.length - marginR;//last block margin-right
		var margin     = Math.round((itHolWidth-blocks)/(this.length-1));
		this.viewShift = outerWidth + margin;
		item.css('left',  '-' + this.viewShift + 'px');
		for(var i = 0; i <= this.length; i++){
			var el   = this.items[i];
			el.css('left', i*this.viewShift + 'px');
			this.itemsHolder.append(el);
			this.viewItems.push(el.get(0));
		}
		this.lastI     = this.length;
		this.viewItems = jQuery(this.viewItems);
	},
	_initButtons: function(){
		this.prevButt.bind('click', 
		                   this._queue.bind(null, this._move.bind(this), this.SHIFT));
		this.nextButt.bind('click', 
		                   this._queue.bind(null, this._move.bind(this), -this.SHIFT));
	},
	_queue: (function(){
		var queueAr  = [];
		var dequeue = function(){
			queueAr.splice(0,1);
			if(queueAr.length > 0){
				queueAr[0].func(queueAr[0].args, dequeue);
			}
		};
		return function(func, args){
			if(queueAr.length === 0){
				func(args, dequeue);
			}
			queueAr.push({
				func: func,
				args: args
			});
		}
	})(),
	_move: function(shift, callback){
		this.viewItems.animate({
			'left': (shift < 0 ? '-=' : '+=') + Math.abs(this.viewShift*this.SHIFT)
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
					this.firstI = this.firstI === this.items.length - 1 ? 0 : ++this.firstI;
					this.lastI  = this.lastI === this.items.length - 1 ? 0 : ++this.lastI;
					var item    = this.viewItems.last();
					var newIt   = this.items[this.lastI];
					var left    = parseInt(item.css('left'));
					newIt.css('left', left + this.viewShift + 'px');
					this.itemsHolder.append(newIt);
					this.viewItems.push(newIt.get(0));
				}else{
					this.viewItems.last().remove();
					this.viewItems.splice(this.viewItems.length - 1, 1);
					this.firstI = this.firstI === 0 ? this.items.length - 1 : --this.firstI;
					this.lastI  = this.lastI === 0 ? this.items.length - 1 : --this.lastI;
					var item    = this.viewItems.first();
					var newIt   = this.items[this.firstI];
					var left    = parseInt(item.css('left'));
					newIt.css('left', left - this.viewShift + 'px');
					this.itemsHolder.prepend(newIt);
					//jQuery colections dosen't support unshift method
					Array.prototype.unshift.call(this.viewItems, newIt.get(0));
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
		}
	}
	jQuery(function(){
		new App();
	});
}());
//bind function
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is"+
			                    "trying to be bound is not callable");
		}
		var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP
					                       ? this
					                       : oThis || window,
					                     aArgs.concat(Array.prototype.slice.call(arguments)));
				};
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}
