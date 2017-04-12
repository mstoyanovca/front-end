var app = angular.module("app", ['ui.bootstrap']);
app.controller("Ctrl", function(articleFactory, suggestionFactory) {
  // change to this later
  var self = this;
  self.title = "";
  self.articles = {};
  self.error = "";
  
  self.submit = function() {
    articleFactory.findAll(self.title).then(function(response) {
      self.error = "";
      if (response.hasOwnProperty('query')) {
        self.articles = response.query.pages;
      } else {
        self.articles = {};
      }
    }, function(errResponse) {
      self.articles = {};
      self.error = 'The search query did not load';
    });
  }
  
  self.findArticle = function(val) {
    return suggestionFactory.findAll(val).then(function(response) {
      return response[1];
    });
  }
});
 
app.factory('articleFactory', function($http, $q) {
  return {
    findAll: function(title) {
      var url = "http://en.wikipedia.org/w/api.php?action=query&generator=search&prop=extracts&exintro&explaintext&exsentences=3&exlimit=max&format=json&callback=JSON_CALLBACK";
      return $http.jsonp(url, {
        params: {
          gsrsearch: title
        }
      }).then(function (response) {
        return response.data;
      }, function(errResponse) {
        console.error('The search query did not load');
        return $q.reject(errResponse);
      });
    }
  };
});

app.factory('suggestionFactory', function($http, $q) {
  return {
    findAll: function(val) {
      var url = "http://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&callback=JSON_CALLBACK";
      return $http.jsonp(url, {
        params: {
          search: val
        }
      }).then(function(response) {
        return response.data;
      }, function(errResponse) {
        console.error('No suggestions were found');
        return $q.reject(errResponse);
      });
    }
  };
});