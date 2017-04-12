angular.module('app', []).controller('MyController', ['$scope', '$timeout', '$interval', function($scope, $timeout, $interval) {
  
  var count = 0;        // current number of steps
  $scope.display = "";
  var sequence = [];    // the array of steps
  var answer = [];      // the array of user input
  var timer1;
  var timer2;
  var tempo = 800;      // speed of playing the sequence
  // boolean flags:
  $scope.turnedOn = false;
  $scope.started = false;
  $scope.strictMode = false;
  $scope.clickable = false;
  // classes:
  $scope.startBtn = "start";
  $scope.strictBtn = "strict";
  $scope.green = "green";
  $scope.red = "red";
  $scope.yellow = "yellow";
  $scope.blue = "blue";
  // functions:
  var addStep;
  var play;
  var listen;
  var alarm;
  var listener;
  var victory;
  
  // UI event handlers:
  $scope.turnOn = function() {
    $scope.turnedOn = !$scope.turnedOn;
    $scope.turnedOn === true ? $scope.display = "--" : $scope.display = "";
    if($scope.turnedOn === false) {
      $scope.clickable = false;
      $timeout.cancel(timer1);
      $interval.cancel(timer2);
      sequence = [];
      answer = [];
      count = 0;
      $scope.display = "";
      $scope.started = false;
      $scope.startBtn = "start";
      $scope.strictMode = false;
      $scope.strictBtn = "strict";
      $scope.green = "green";
      $scope.red = "red";
      $scope.yellow = "yellow";
      $scope.blue = "blue";
    }
  };
  
  $scope.start = function() {
    if(!$scope.turnedOn) return;
    $scope.started = !$scope.started;
    if($scope.started) {
      $scope.startBtn = "start started";
      addStep();
      play();
    } else {
      $scope.clickable = false;
      $timeout.cancel(timer1);
      $interval.cancel(timer2);
      count = 0;
      sequence = [];
      answer = [];
      $scope.display = "--";
      $scope.startBtn = "start";
      $scope.green = "green";
      $scope.red = "red";
      $scope.yellow = "yellow";
      $scope.blue = "blue";
    }
  };
  
  $scope.turnStrict = function() {
    if(!$scope.turnedOn) return;
    $scope.strictMode = !$scope.strictMode;
    $scope.strictMode === true ? $scope.strictBtn = "strict strict-on" : $scope.strictBtn = "strict";
  };
  
  // green/red/yellow/blue mousedown/mouseup events:
  $scope.greenClick = function(enable) {
    if(enable) {
      $scope.green = "green green-clicked";
      document.getElementById("audio").setAttribute("src", "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
      document.getElementById("audio").play();
      $timeout(function() {$scope.green = "green";}, 300);
      if($scope.clickable) listener(1);
    }
  };
  
  $scope.redClick = function(enable) {
    if(enable) {
      $scope.red = "red red-clicked";
      document.getElementById("audio").setAttribute("src", "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
      document.getElementById("audio").play();
      $timeout(function() {$scope.red = "red";}, 300);
      if($scope.clickable) listener(2);
    }
  };
  
  $scope.yellowClick = function(enable) {
    if(enable) {
      $scope.yellow = "yellow yellow-clicked";
      document.getElementById("audio").setAttribute("src", "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
      document.getElementById("audio").play();
      $timeout(function() {$scope.yellow = "yellow";}, 300);
      if($scope.clickable) listener(3);
    }
  };
  
  $scope.blueClick = function(enable) {
    if(enable) {
      $scope.blue = "blue blue-clicked";
      document.getElementById("audio").setAttribute("src", "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
      document.getElementById("audio").play();
      $timeout(function() {$scope.blue = "blue";}, 300);
      if($scope.clickable) listener(4);
    }
  };
  
  // BUSINESS LOGIC:
  // add a new step into the sequence:
  addStep = function() {
    var step = Math.floor(Math.random() * 4) + 1;
    sequence.push(step);
    count++;
    if(count < 10 ) {
      $scope.display = "0" + count;
    } else {
      $scope.display = count;
    }
    if(count === 5 || count === 9 || count === 11) {
      tempo = 500;
    } else {
      tempo = 800;
    }
  };
  
  // play the current sequence:
  play = function() {
    var i = 0;
    function playSingle() {
      switch(sequence[i]) {
        case 1:
          $scope.greenClick(true);
          break;
        case 2:
          $scope.redClick(true);
          break;
        case 3:
          $scope.yellowClick(true);
          break;
        case 4:
          $scope.blueClick(true);
          break;
      }
      i++;
      if(i < sequence.length) {
        timer1 = $timeout(function() {playSingle();}, tempo);
      } else {
        // end of the recursion, callback return:
        timer1 = $timeout(function() {listen();}, tempo);
      }
    }
    playSingle();
  };
  
  // wait for user input:
  listen = function() {
    answer = [];
    $scope.clickable = true;
    timer1 = $timeout(function() {
      $scope.clickable = false;
      alarm();
    }, 3000);
  };
  
  // green/red/yellow/blue click event listener:
  listener = function(num) {
    $timeout.cancel(timer1);
    answer.push(num);
    timer1 = $timeout(function() {
      $scope.clickable = false;
      alarm();
    }, 3000);
    if(answer[answer.length - 1] != sequence[answer.length - 1]) {
      $scope.clickable = false;
      $timeout.cancel(timer1);
      // avoid runtime exception:
      $timeout(function() {alarm();}, 100);
    } else if(answer.length === sequence.length) {
      // end of game:
      if(sequence.length === 20) {                                      // modify for testing
        $scope.clickable = false;
        $timeout.cancel(timer1);
        timer1 = $timeout(function() {
          victory();
        }, 800);
        return;
      }
      $scope.clickable = false;
      $timeout.cancel(timer1);
      timer1 = $timeout(function() {
        addStep();
        play();
      }, 2000);
    }
  };
  
  // alarm on wrong user input:
  alarm = function() {
    // error beep:
    document.getElementById("audio").setAttribute("src", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/721194/error-alert.mp3");
    document.getElementById("audio").play();
    var flag = false;
    var displayOld = $scope.display;
    function changeDisplay() {
      flag = !flag;
      flag ? $scope.display = "!!!" : $scope.display = "";
    }
    // flash "!!" 2 times:
    timer2 = $interval(function() {changeDisplay();}, 500, 4);
    timer1 = $timeout(function() {
      if($scope.strictMode) {
        count = 0;
        sequence = [];
        addStep();
        play();
        return;
      }
      $scope.display = displayOld;
      play();
    }, 2500);
  };
  
  // end of the game:
  victory = function() {
    $scope.display = "**";
    // end of the game beep:
    document.getElementById("audio").setAttribute("src", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/721194/demonstrative.mp3");
    document.getElementById("audio").play();
  }
  
}]);