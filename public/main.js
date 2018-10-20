// https://codepen.io/anon/pen/JmOqzL
// http://jsbin.com/mamoyunuda/1/edit?html,js,output
// http://embed.plnkr.co/LbUpyo/
// https://stackoverflow.com/questions/16881478/how-to-call-a-method-defined-in-an-angularjs-directive
let flowApp = angular.module('myFlow', []);


// HTMLDocument.prototype.ready = new Promise(function (resolve) {
//   if (document.readyState != "loading") {
//         return resolve();
//   } else {
//     document.addEventListener("DOMContentLoaded", function () {
//         return resolve();
//     });
//   }
// });

// document.ready.then(function () {
//   console.log("document ready");
//   var a = document.querySelectorAll('rect');
//   console.log(a);
// });

flowApp.controller('mainCtr', function ($scope) {
  let stateStatus = 'inital';
  let initalX = 0;
  let initalY = 0;
  let nextId = 1;
  let stateNum = 5;
  let horizontalDis = 100;
  let verticalDis = 100;
  let stateColors = {
    default : 'gray',
    success : 'green',
    fail : 'red',
    stop : 'yellow',
  }

  $scope.toAdd = false;

  $scope.stateData = [
      { id: 0, status: stateStatus, color : stateColors.default, x: initalX, y : initalY },
  ];

  $scope.outerControl = {};
  

  $scope.goToAdd = function (toAdd) {
    if (toAdd === true) {
      $scope.addState();
      $scope.outerControl.draw($scope.stateData);
    } else {
      return;
    } 
  }

  $scope.addState = function () {
      let nextX = nextId * horizontalDis;
      if ($scope.stateData.length < stateNum) {
          $scope.stateData.push({
            id: nextId,
            status: stateStatus,
            color : stateColors.default,
            x: nextX,
            y: initalY
          });
      }
      console.log($scope.stateData);
      // $scope.outerControl.draw($scope.stateData);
      nextId++;
  };

  $scope.clearState = function () {
      while ($scope.stateData.length > 1) {
        $scope.stateData.pop();
      }
      nextId = 1;
      $scope.outerControl.draw($scope.stateData);
  };

  $scope.updateStatus = function (newSta) {
    $scope.judgeState(newSta);
  }

  $scope.judgeState = function (num) {
    let success = '1';
    let fail = '2';
    let stop = '3';
    let clear = '4';
    let currEle = $scope.stateData[$scope.stateData.length - 1];
    switch (num) {
        case success:
        currEle.status = 'success';
        currEle.color = stateColors.success;
        $scope.outerControl.draw($scope.stateData);
        break;
      case fail:
        currEle.status = 'fail';
        currEle.color = stateColors.fail;
        $scope.outerControl.draw($scope.stateData);
        console.log($scope.stateData);
        break;
      case stop:
        currEle.status = 'stop';
        currEle.color = stateColors.stop;
        $scope.outerControl.draw($scope.stateData);
        console.log('stop');
        break;
      case clear:
        currEle = $scope.stateData[0];
        currEle.status = 'inital';
        currEle.color = stateColors.default;
        $scope.clearState();
        console.log('clear');
        break;
      default:
        stateColor = stateColors.default;
        console.log('no state');
    }
  }

  $scope.$watch('stateData',
    function () {
        $scope.outerControl.draw($scope.stateData);
  }, true);

});







