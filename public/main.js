let flowApp = angular.module('myFlow', []);

flowApp.controller('mainCtr', function ($scope) {

  // initialize: 
  let stateStatus = 'inital';
  let initalX = 0;
  let initalY = 0;
  let nextId = 1;
  let stateNum = 5;
  let horizontalDis = 100;
  let stateColors = {
    default : 'gray',
    success : 'green',
    fail : 'red',
    stop : 'maroon',
  }

  $scope.toAdd = false;
  $scope.isMoved = false;
  localStorage.clear();


  $scope.getMoved = function (isMoved) {
     if (isMoved) {
     $scope.isMoved = isMoved;
    }
  }

  // keep the data and data opertaions (CRUD) saparate from node component
  // node compoent is in charge of rendering svg
  $scope.stateData = [
      { id: 0, 
        status: stateStatus, 
        color : stateColors.default,
        x : initalX, 
        y : initalY
      },
  ];
  
  // for accessing the angular directive (component) function
  $scope.outerControl = {};
  
  
  // @param  toAdd
  //         from the node component, the second comfirmation to add state 
 
  $scope.goToAdd = function (toAdd) {
    if (toAdd === true) {
      $scope.addState();
      $scope.outerControl.draw($scope.stateData);
    } else {
      return;
    } 
  }
  
  // add new state
  $scope.addState = function () {
    let nextX;
    if ($scope.isMoved == true) {
      nextX = JSON.parse(localStorage.getItem('coor')).currX + horizontalDis;
      initalY= JSON.parse(localStorage.getItem('coor')).currY - 25;
    } else {
      if (JSON.parse(localStorage.getItem('coor')) == null) {
         nextX = nextId * horizontalDis;
      } else {
        nextX = JSON.parse(localStorage.getItem('coor')).currX + horizontalDis * nextId;
      }
    }
    if ($scope.stateData.length < stateNum) {
        $scope.stateData.push({
          id: nextId,
          status: stateStatus,
          color : stateColors.default,
          x: nextX,
          y: initalY
        });
    }
    $scope.isMoved = false;
    nextId++;
  };

  // clear all states and go back to the original state

  $scope.clearState = function () {
    let lines = document.querySelectorAll('line');
    lines.forEach(e => e.remove());

    while ($scope.stateData.length > 1) {
      $scope.stateData.pop();
    }
    $scope.stateData[$scope.stateData.length - 1]['x'] = 0;
    $scope.stateData[$scope.stateData.length - 1]['y'] = 0;
    nextId = 1;
    initalX = 0;
    initalY = 0;
    $scope.isMoved = false;
    localStorage.clear();
    $scope.outerControl.draw($scope.stateData);
  };

  // @param  newSta
  //         from the node component, the first comfirmation to select the status 

  $scope.updateStatus = function (newSta) {
    $scope.judgeState(newSta);
  }

  // @param  newSta
  //         from the node component, the first comfirmation to select the status 
  // to judge each status's behavior

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
        break;
      case stop:
        currEle.status = 'stop';
        currEle.color = stateColors.stop;
        $scope.outerControl.draw($scope.stateData);
        break;
      case clear:
        currEle = $scope.stateData[0];
        currEle.status = 'inital';
        currEle.color = stateColors.default;
        $scope.clearState();
        break;
      default:
        stateColor = stateColors.default;
    }
  }
  // watch the data source changes
  $scope.$watch('stateData',
    function () {
        $scope.outerControl.draw($scope.stateData);
  }, true);

});







