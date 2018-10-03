(function($) {

  "use strict";

  if ( typeof DataTable !== 'undefined' ) {
	  // Controls the custom Data Table created
	  $( '[data-table]' ).DataTable( {
		  "paging":    false,
		  "info":      false,
		  "searching": false,
	  } );
  }


  $(".collapse").on('show.bs.collapse', function(e) {
    if ($(this).is(e.target))
      $(this).parent().parent().find('.collapse.show').collapse('hide');
  });

})(jQuery);