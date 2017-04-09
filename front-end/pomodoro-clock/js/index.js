angular.module('myApp', ['ngAnimate', 'ui.bootstrap']).controller('MyController', function ($scope, $interval) {
  
  $scope.sessionLength = new Date();
  $scope.breakLength = new Date();
  var sessionCountdown;   // promise variables
  var breakCountdown;     //
  $scope.step = 1;
  var inSession = false;  // boolean flags
  var inBreak = false;    // 
  var pause = false;      //
  
  $scope.start = function() {
    // disable input from the timepickers:
    $scope.step = 0;
    if(!inSession && !inBreak) {
      inSession = true;
      doSession();
    } else if(inSession && pause) {
      pause = false;
      doSession();
    } else if(inBreak && pause) {
      pause = false;
      doBreak();
    } 
  };
  
  function doSession() {
    // session length in seconds:
    var count = $scope.sessionLength.getHours() * 60 * 60 + 
                       $scope.sessionLength.getMinutes() * 60 + 
                       $scope.sessionLength.getSeconds();
    var i = count;
    sessionCountdown = $interval(function() {
      $scope.sessionLength.setSeconds($scope.sessionLength.getSeconds() - 1);
      i -= 1;
      // reasignment needed to update the timepicker:
      var d = new Date($scope.sessionLength);
      $scope.sessionLength = d;
      if(i === 0) {
        inSession = false;
        inBreak = true;
        playAudio();
        doBreak();
      }
    }, 1000, count);
  }
  
  function doBreak() {
    // break length in seconds:
    var count = $scope.breakLength.getHours() * 60 * 60 + 
                     $scope.breakLength.getMinutes() * 60 + 
                     $scope.breakLength.getSeconds();
    var i = count;
    breakCountdown = $interval(function() {
      i -= 1;
      $scope.breakLength.setSeconds($scope.breakLength.getSeconds() - 1);
      // update the timepicker:
      d = new Date($scope.breakLength);
      $scope.breakLength = d;
      if(i === 0) {
        $scope.reset();
      }
    }, 1000, count);
  }
  
  $scope.pause = function() {
    pause = true;
    if(inSession) {
      $interval.cancel(sessionCountdown);
    } else if(inBreak) {
      $interval.cancel(breakCountdown);
    }
  };
  
  $scope.reset = function() {
    $scope.step = 1;
    inSession = false;
    inBreak = false;
    $interval.cancel(sessionCountdown);
    $interval.cancel(breakCountdown);
    // session:
    $scope.sessionLength.setHours(0);
    $scope.sessionLength.setMinutes(25);
    $scope.sessionLength.setSeconds(0);
    // needed to update the UI:
    var d = new Date($scope.sessionLength);
    $scope.sessionLength = d;
    // break:
    $scope.breakLength.setHours(0);
    $scope.breakLength.setMinutes(5);
    $scope.breakLength.setSeconds(0);
    // same here:
    d = new Date($scope.breakLength);
    $scope.breakLength = d;
  };
  
  // initialization:
  $scope.reset();
  
  // clean up:
  $scope.$on('$destroy', function() {
    $interval.cancel(sessionCountdown);
    $interval.cancel(breakCountdown);
  });
  
  // play sound:
  function playAudio() {
    document.getElementById("myAudio").play();
  }
});