var Carousel = (function(){
	var Carousel = function(holder){
		this.holder = jQuery(holder);
		this.width  = this.holder.innerWidth();
		this._initButtons();
	}
	Carousel.prototype = {
		_initButtons: function(){
			var prev = this.holder.find('.b-carousel__button_action_prev');
			console.log(this.holder);
			prev.bind('click', this._prev.bind(this));
		},
		_next: function(){
			
		},
		_prev: function(){
			
		},
	}
	return Carousel;
})();
jQuery(function(){
	new Carousel('.b-carousel');
});
