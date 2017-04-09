var id = Math.floor(Math.random()*10000000);
var url = "http://api.forismatic.com/api/1.0/?method=getQuote&key=" + id + "&format=jsonp&lang=en&jsonp=?";
var text;
var author;

$(document).ready(function() {
  $("#button").on("click", function() {
    $.getJSON(url, function(data) {
      text = data['quoteText'];
      author = data['quoteAuthor'];
      var html = "<p>" + text + "</p>" + "<footer>" + author + "</footer>";
      $(".quote").html(html);
    });
  });
  $("#tweet").on("click", function() {
    var tweetURL = 'https://twitter.com/intent/tweet/?text=' + text + author;
    window.open(tweetURL);
  });
  $('#button').trigger("click");
});