$(function() {
  
  $('a').pjax('#content');;

  var from = 5
    , top = true;
  $(window).scroll(function(e) {
    var offset = $(window).scrollTop();
    
    if (top && offset > from) {
      top = false;
      $('#shadow').addClass('active');
    } else if (!top && offset <= from) {
      top = true;
      $('#shadow').removeClass('active');
    }
  });


  $('.post').each(function(i, post) {
    var el = $(post).find('.comment-body')[0]
      , editor = CodeMirror.fromTextArea(el, {
            mode: 'gfm'
          , matchBrackets: true
          , value: el.value
      });
  });
  
});


