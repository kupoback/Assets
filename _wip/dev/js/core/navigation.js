/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function ($) {

  "use strict";

  var $body = $('body'),
    $navSlider = $('.nav-slider'),
    $navMask = $('.nav-mask'),
    $bodyMask = $('#bodymask'),
    $navToggler = $('.navbar-toggler'),
    $parent = $('.menu-item-has-children'),
    $parentLink = $('.dropdown-toggle'),
    $childContainer = $('.dropdown-menu'),
    timer;

  function setHeightToNav() {

    if ($(window).width() < 992) {
      var $navHeight = $('#masthead').outerHeight(),
        $superNav = $('#supernav').outerHeight();

      if ($body.hasClass('logged-in')) {
        var $wpAdminBar = $('#wpadminbar').outerHeight();

        $navSlider.css({
          'top': $wpAdminBar + 'px',
          'margin-top': ($navHeight) + 'px'
        });

      } else {
        $navSlider.css({'margin-top': ($navHeight) + 'px'});
      }
    } else {
      if ($body.hasClass('logged-in')) {
        $navSlider.css({top: 0 + 'px'});
      }
      $navSlider.css({marginTop: 0 + 'px'});
    }

  }

  function close() {
    $body.removeClass('has-active-menu');

    $navSlider.removeClass('toggling');
    $parent.removeClass('show');
    $navToggler.removeClass('active');

    if ($(window).width() < 992) {

      $('.nav-item')
        .removeClass('show')
        .find('.nav-link').attr('aria-expanded', false)
        .next('.dropdown-menu').removeClass('show').slideUp(150);

    } else {
      // $('.nav-link').attr('aria-expanded', false)
      //   .next('.dropdown-menu').hide().removeClass('show');
    }

  }

  function open() {
    $body.addClass('has-active-menu');
    $navSlider.addClass('toggling');
    $navToggler.addClass('active');
  }

  function cloneSuperNav() {
    if ($(window).width() < 992) {
      if (!$('#site-navigation #supernav-menu').length) {
        $('#supernav-menu').clone().addClass('clone').appendTo('#site-navigation');
      }
    } else {
      $('#site-navigation #supernav-menu').remove();
    }
  }

  $navMask.on('click', function () {
    close();
  });
  $navToggler.on('click', function () {
    if ($('body').hasClass('has-active-menu'))
      close();
    else
      open();
  });

  $bodyMask.on('click', function () {
    close();
  });

  $parentLink.on('click', function (e) {
    var $this = $(this),
      $thisParent = $this.parent();

    e.preventDefault();

    // if ( $(window).width() < 1025 ) {

    if ($thisParent.hasClass('show')) {

      $thisParent.removeClass('show');

      if ($(window).width() < 992) {
        $('.nav-link').attr('aria-expanded', false)
          .next('.dropdown-menu').slideUp(150).removeClass('show');
      } else {
        // $('.nav-link').attr('aria-expanded', false)
        //   .next('.dropdown-menu').hide().removeClass('show');
      }

      if (!$this.is('[href*=#]')) {
        location.assign($(this).attr('href'));
      } else {
        e.preventDefault();
      }
    } else {

      if ($(window).width() < 992) {
        $('.nav-item.show').not($this)
          .removeClass('show')
          .find('.nav-link').attr('aria-expanded', false)
          .next('.dropdown-menu').removeClass('show').slideUp(150);

        $this.next($childContainer).slideDown(150);

      } else {
        // open();
        // $('.nav-item.show').not($this)
        //   .removeClass('show')
        //   .find('.nav-link').attr('aria-expanded', false)
        //   .next('.dropdown-menu').removeClass('show').hide();
        //
        // $this.next($childContainer).show();

      }

      $thisParent.addClass('show');

    }

  });

  $(function () {

    setHeightToNav();
    cloneSuperNav();

  });

  $(window).scroll(function () {
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function () {
      // do something
      setHeightToNav();
    }));
  });

  $(window).on('resize', function (e) {

    close();

    // Reset
    var width = $(window).width();
    setHeightToNav();

    cloneSuperNav();

  });

})(jQuery);