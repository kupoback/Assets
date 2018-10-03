(function($) {
	$(function() {
		if ( ! Modernizr.objectfit ) {
			$('.object-fit').each(function () {
				var $container = $(this),
				    imgUrl = $container.find('img').prop('src');
				if (imgUrl) {
					$container
						.css('backgroundImage', 'url(' + imgUrl + ')')
						.addClass('compat-object-fit');
				}
			});
		}
		if ( ! Modernizr.svgasimg ) {
			$("img[src$='.svg']")
				.addClass('svg-set-dimensions')
		} else {
			$("img[src$='.svg']")
				.addClass('svg-set-width')
		}

	});
})(jQuery);