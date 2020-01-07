/*
 * Enowo - Restaurant Directory HTML Template
 *
 * This file contains all theme JS functions
 *
 * @package 
--------------------------------------------------------------
				   Contents
--------------------------------------------------------------
  * 01 -  Owl Caserol
            - Home Slider
            - Popular-Food-Slider
            - Collection Slider 
  * 02 -  Navigation
  * 03 -  Video Play
  * 04 -  Mailchimp Form
  * 05 -  Preloader
  * 06 -  Filter
--------------------------------------------------------------*/

(function($) {
  "use strict";

  var $window = $( window )
  var search = $( '.search' )

/* ================================= */
  /*===== Owl Caserol =====*/
/* ================================= */
// Home Slider  
    $("#home-slider").owlCarousel({
      loop: true,
      items: 2,
      dots: false,
      nav: true,      
      autoplayTimeout: 10000,
      smartSpeed: 2000,
      autoHeight: false,
      touchDrag: true,
      mouseDrag: true,
      margin: 0,
      autoplay: true,
      slideSpeed: 600,
      navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>', '<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
      responsive: {
        0: {
            items: 1,
            nav: false,
            dots: false,
        },
        600: {
            items: 1,
            nav: false,
            dots: false,
        },
        768: {
            items: 1,
            nav: true,
            dots: false,
        },
        1100: {
            items: 1,
            nav: true,
            dots: false,
        }
      }
    });

    // Popular-Food-Slider  
    $("#popular-food-slider").owlCarousel({
      loop: true,
      items: 3,
      dots: true,
      nav: false,      
      autoplayTimeout: 10000,
      smartSpeed: 2000,
      autoHeight: false,
      touchDrag: true,
      mouseDrag: true,
      margin: 30,
      autoplay: true,
      slideSpeed: 600,
      navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>', '<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
      responsive: {
        0: {
            items: 1,
            nav: false,
            dots: true,
        },
        600: {
            items: 1,
            nav: false,
            dots: true,
        },
        768: {
            items: 2,
            nav: false,
            dots: true,
        },
        1100: {
            items: 2,
            nav: false,
            dots: true,
        }
      }
    });

    // Collection Slider  
    $("#collection-slider").owlCarousel({
      loop: true,
      items: 3,
      dots: true,
      nav: false,      
      autoplayTimeout: 10000,
      smartSpeed: 2000,
      autoHeight: false,
      touchDrag: true,
      mouseDrag: true,
      margin: 30,
      autoplay: true,
      slideSpeed: 600,
      navText: ['<i class="fa fa-chevron-left" aria-hidden="true"></i>', '<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
      responsive: {
        0: {
            items: 1,
            nav: false,
            dots: true,
        },
        600: {
            items: 2,
            nav: false,
            dots: true,
        },
        768: {
            items: 2,
            nav: false,
            dots: true,
        },
        1100: {
            items: 3,
            nav: false,
            dots: true,
        }
      }
    });


/* ================================= */
    /*===== Navigation =====*/
/* ================================= */   
  $("#cssmenu").menumaker({
      title: "Menu",
      format: "multitoggle"
  });

/* ================================= */
    /*===== Video Play =====*/
/* ================================= */    
  $('.btn-video-play').on('click',function() {
    $('.video-item .video-preview').append(video_url);
    $(this).hide();
  }); 

/* ================================= */
  /*===== Mailchimp Form =====*/
/* ================================= */
  $('#newsletter-form-widget').ajaxChimp({
      url: 'http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh9' // Insert Your Link
  });   
  
/* ================================= */
    /*===== Preloader =====*/
/* ================================= */ 
  $window.on('load', function()  { 
    $('.status').fadeOut();
    $('.preloader').delay(350).fadeOut('slow'); 
  }); 

/* ========================= */
  /*===== Filter =====*/
/* ========================= */
  // Products Filter
    var selectedClass = "";
      $(".fil-cat").on('click',function(){ 
      selectedClass = $(this).attr("data-rel"); 
       $("#ver-one-product-main-block").fadeTo(100, 0.1);
      $("#ver-one-product-main-block .products-block-col").not("."+selectedClass).fadeOut().removeClass('scale-anm');
      setTimeout(function() {
        $("."+selectedClass).fadeIn().addClass('scale-anm');
        $("#ver-one-product-main-block").fadeTo(300, 1);
      }, 300);     
      $(this).siblings().removeClass('btn-active');
      $(this).addClass('btn-active');
    });

      // Cart Js       
    // on mouse enter show cart widget
      $("#cart").hover(function() {
        $(".cart-box").addClass("active");
      });
    // on mouse leave hide cart widget
      $(".cart-box").mouseleave(function() {
        $(".cart-box").removeClass("active");
      }); 


})(jQuery);