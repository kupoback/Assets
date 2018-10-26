(function( $ ) {

  "use strict";
	
	if ( typeof owlCarousel !== 'undefined' ) {
		
		const defaultOptionSettings = {
			      loop:       true,
			      margin:     10,
			      items:      1,
			      mouseDrag:  true,
			      touchDrag:  true,
			      dots:       false,
			      responsive: {
				      0:   {
					      autoplay:           true,
					      autoplayTimeout:    5000,
					      autoplayHoverPause: true,
				      },
				      768: {
					      autoplay: false,
				      }
			      }
		      },
		      owlSlider             = $( '.owl-carousel' );
		
		owlSlider.owlCarousel( defaultOptionSettings );
		
		$( window ).resize( function () {
			
			//owlSlider.owlCarousel('destroy');
			
			owlSlider.owlCarousel( defaultOptionSettings );
			
		} );
	}

})( jQuery );