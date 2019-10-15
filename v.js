jQuery.fn.extend({
  v: function(url) {
    var div = $(this);
    div.attr('data-url', url);
  },
  refresh: function() {
    var div = $(this);
    var url = div.attr('data-url');

    if (url) {
      div.animate({opacity: "0"}, 200);
      div.addClass('loading');
      $.ajax({
        url: url,
        dataType: 'html',
        success: function(response) {
          div.html(response).animate({opacity: "1"}, 200);
          div.removeClass('loading');
        },
        error: function(a, b, c) {
          div.html(a.responseText).animate({opacity: "1"}, 200);
        }
      });
    }
  },
});

function refreshAll() {
  $('*[data-url]').each(function(){
    $(this).refresh();
  });
}