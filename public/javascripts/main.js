T0 = function() {
  
  
  return {
    init: function() {
      $('#navme').click(function(){
        $(this).toggleClass('selected');
        $('#me').toggleClass('hidden');
      });
    }
    
  };
  
}();


$(T0.init);