var Carousel = function(holder){
	this.holder = jQuery(holder);
	this.items  = this.holder.find('.b-carousel__item');
	this.width  = this.holder.innerWidth();
	this.itemWidth = this.items.outerWidth(true);
	console.log(this.itemWidth);
	this._initBlocks();
	this._initButtons();
}
Carousel.prototype = {
	ANIMATE_TIME: 1000,
	_initBlocks: function(){
		this.items.each((function(i, el){
			jQuery(el).css('left', i*this.itemWidth + 'px');
		}).bind(this));
	},
	_initButtons: function(){
		var prev = this.holder.find('.b-carousel__button_action_prev');
		var next = this.holder.find('.b-carousel__button_action_next');
		prev.bind('click', this._prev.bind(this));
		next.bind('click', this._next.bind(this));
	},
	_next: function(){
		this._move(1);
	},
	_prev: function(){
		this._move(-1);
	},
	_move: function(shift){
		var first = this.items.first();
		this.items.animate({
			left: (shift < 0 ? '-=' : '+=') + Math.abs(this.itemWidth*shift),
		}, this.ANIMATE_TIME);
	},
}
jQuery(function(){
	new Carousel('.b-carousel');
});
