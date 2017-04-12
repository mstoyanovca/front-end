var app = angular.module("app", ['ui.bootstrap']);
app.controller("Ctrl", function($scope, ChannelService) {
  
  $scope.channels = [];
  $scope.usernames = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
  $scope.username = "";
  $scope.type = "";
  
  $scope.findAll = function() {
    $scope.channels = [];
    $scope.type = "All channels";
    for (var i = 0; i < $scope.usernames.length; i++) {
      ChannelService.findChannel($scope.usernames[i]).then(
      function(response) {
        $scope.channels.push(response);
      }, function(errResponse) {
        console.error("Channel could not be found");
      });
    }
  };
  
  $scope.findOnline = function() {
    $scope.channels = [];
    $scope.type = "Online channels";
    for (var i = 0; i < $scope.usernames.length; i++) {
      ChannelService.findChannel($scope.usernames[i]).then(
      function(response) {
        if (response.status != "Offline" && response.status != "Account is closed") {
          $scope.channels.push(response);
        }
      }, function(errResponse) {
        console.error("Channel could not be found");
      });
    }
  };
  
  $scope.findOffline = function() {
    $scope.channels = [];
    $scope.type = "Offline channels";
    for (var i = 0; i < $scope.usernames.length; i++) {
      ChannelService.findChannel($scope.usernames[i]).then(
      function(response) {
        if (response.status == "Offline") {
          $scope.channels.push(response);
        }
      }, function(errResponse) {
        console.error("Channel could not be found");
      });
    }
  };
  
  $scope.findClosed = function() {
    $scope.channels = [];
    $scope.type = "Closed channels";
    for (var i = 0; i < $scope.usernames.length; i++) {
      ChannelService.findChannel($scope.usernames[i]).then(
      function(response) {
        if (response.status == "Account is closed") {
          $scope.channels.push(response);
        }
     }, function(errResponse) {
       console.error("Channel could not be found");
     });
    }
  };
  
  // from the search box
  $scope.findChannel = function(username) {
    ChannelService.findChannel(username).then(
      function(response) {
        $scope.channels.push(response);
     }, function(errResponse) {
       console.error("Channel could not be found");
     });
  };
  
  $scope.submit = function() {
    $scope.channels = [];
    $scope.type = "Select channels";
    $scope.findChannel($scope.username);
  };
  
  $scope.findAll();
});

app.factory('ChannelService', function($http, $q) {
  return {
    findChannel: function(username) {
      var API_URL = "https://api.twitch.tv/kraken/streams/" + username + "?callback=JSON_CALLBACK";
      return $http({
          method: 'JSONP',
          url: API_URL
        }).then(function successCallback(response) {
          var channel = {imgLink:"", displayName:"", channelURL:"", status:""};
          if(response.data.status == '422') {
            // account is closed:
            channel.imgLink = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/721194/closed-icon.png";
            channel.displayName = username;
            channel.channelURL = "https://www.twitch.tv/" + username;
            channel.status = "Account is closed";
            return channel;
          } else if (response.data.stream == null) {
            // offline:
            channel.imgLink = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/721194/offline-icon.png";
            channel.displayName = username;
            channel.channelURL = "https://www.twitch.tv/" + username;
            channel.status = "Offline";
            return channel;
          } else {
            // online:
            var data = response.data.stream.channel;
            channel.imgLink = data.logo;
            channel.displayName = data.display_name;
            channel.channelURL = data.url;
            channel.status = data.game + ": " + data.status;
            return channel;
          }
        }, function errorCallback(response) {
          console.error("Query did not execute");
          return $q.reject(errResponse);
      });    
    }
  };
});