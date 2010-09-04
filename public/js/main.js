T0 = function() {
  
  
  return {
    init: function() {
      $(document).click(function(e){
        if (e.target.tagName === 'BODY' || e.target.tagName === 'HTML') {
          $('#container').toggleClass('fixed');
        }
      });
    }
    
  };
  
}();


$(T0.init);