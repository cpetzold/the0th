$(function() {
  
  $('a').pjax('#content');

  var el = $('#content')
    , amount = 120
    , i = 0
    , posts = $('.post')
    , moving = false;

  $(posts[0]).addClass('active');
  
  $(window).keydown(function(e) {
    switch (e.keyCode) {
      case 37: 
        if (i && !moving) return moveTo(--i);
        break;
      case 39:
        if (i < posts.length - 1 && !moving) return moveTo(++i);
        break;
    }
  });

  window.moveTo = function(i) {
    posts.removeClass('active');
    $(posts[i]).addClass('active');
    moving = true;
    el.css('left', -i * amount + '%');
    setTimeout(function() {
      moving = false;
    }, 501);
  }

  el[0].addEventListener('transitionend', function(e) {
    console.log(e);
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


