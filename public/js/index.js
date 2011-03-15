(function($) {

  $('nav a').hover(function(){
    
    $(this).animate({"padding-bottom":"15px"}, "fast", "linear");
    
  }, function(){
    
    $(this).animate({"padding-bottom":"10px"}, "fast", "swing");
    
  });
  
  
})(jQuery);