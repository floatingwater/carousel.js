console.log(Carousel);

var Carousel = (function(){
	var Carousel = function(){
		if(this instanceof Carousel)	{
			console.log('yes');
		}
	}
	Carousel.prototype = {
		_initButtons: function(){
			
		},
	}
	return new Carousel();
})();
