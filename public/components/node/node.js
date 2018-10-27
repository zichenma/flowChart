flowApp.directive('node', function($window){
    return{
       restrict:'EA',
       scope : {
        stateData : '=',
        getStatus : '&',
        isAdd : '&',
        control : '=',
        setPre : '&',
        setMoved : '&'
      },
      template:"<svg width='1200' height='500'></svg>",
        link: function(scope, elem){
            // export component scope to controller
            scope.internalControl = scope.control || {};
            // initialize d3 and svg
            let d3 = $window.d3;
            let rawSvg = elem.find('svg');
            let svg = d3.select(rawSvg[0]);
            let allLines = [];
            let width = 50;
            let height = 50;
            scope.currEle = null;
            let moved = false;


            
         

            // @param  stateData
            // from the controller, to draw the svg
            scope.internalControl.draw = function (stateData) {
                stateData = scope.stateData;
                let drag = d3.behavior.drag()
                    .origin(function(d) { return d;})
                    .on("dragstart", function () {
                      d3.event.sourceEvent.stopPropagation();
                    })
                    .on("drag", dragmove)
                    .on("dragend", function (obj) {
                      obj.x = this.attributes.x.value;
                      obj.y = this.attributes.y.value;
                    });
                let rects = svg.selectAll("rect")
                    .data(stateData, function (d) { 
                        return d.id;
                    })
                rects.enter()
                  .append("rect")
                  .attr("id", function(d) {return "box-" + d.id;})
                  .attr('class', function (d) { 
                          return setClass(d.id); 
                   })
                  .attr("width", 50)
                  .attr("height", 50)
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("fill", 'blue')
                  .on ("click", function () {
                    if (d3.event.defaultPrevented) {
                        return;
                    }
                    scope.currEle = d3.select(this);
                    openPrompt();
                  })
                  .call(drag);
                rects.transition()
                  .attr("x", function (d) { return d.x })
                  .attr("y", function (d) { return d.y })
                  .transition()
                  .attr("fill", function (d) {return d.color});
                rects.exit()
                  .transition()
                    .attr("fill", 'red')
                  .transition()
                    .attr("height", height)
                    .attr("width", width)
                    .remove();
              }
              // according to id set the class for drag feature
              function setClass (id) {
                if ( id % 2 == 0) {
                    return 'source';
                } else {
                    return 'target';
                }
              }

              

              function updateFirst (allLineData, x, y) {
                    allLineData[0][0]['x'] = x + width;
                    allLineData[0][0]['y'] = y;
              }

              function updateSecond (allLineData, x, y) {
                    allLineData[0][1]['x'] = x;
                    allLineData[0][1]['y'] = y;
              }

              function updateRest (allLineData, x, y, d) {
                // let preRect = scope.stateData[scope.stateData.length - 2];
                // let nextRect = scope.stateData[d.id + 1];
                let preLineIdx = d.id - 1;

                if (d.id === 0) {
                    updateFirst (allLineData, x, y, d)
                } else if (d.id === allLineData.length) {
                    updateLast (allLineData, x, y, d)
                } else {
                    allLineData[preLineIdx][1]['x'] = x;
                    allLineData[preLineIdx][1]['y'] = y;
                    allLineData[d.id][0]['x'] = x + 50;
                    allLineData[d.id][0]['y'] = y;
                }
              }

              function updateLast (allLineData, x, y, d) {
                    //let preLineIdx = d.id - 1;
                    // console.log(preLineIdx);
                    // console.log(scope.stateData[scope.stateData.length - 2]);
                   // allLineData[allLineData.length - 1][0]['x'] = scope.stateData[scope.stateData.length - 2]['x'] + 50;
                    //allLineData[allLineData.length - 1][0]['y'] = scope.stateData[scope.stateData.length - 2]['y'] + 25;
     
                    allLineData[allLineData.length - 1][1]['x'] = x;
                    allLineData[allLineData.length - 1][1]['y'] = y;
              }

              function dragmove(d) {
                d3.select(this)
                    .attr("x", d3.event.x)
                    .attr("y", d3.event.y);
                moved = true;
                scope.setMoved({isMoved : moved})
            // console.log(d);
               // console.log(d.id);
                //console.log(scope.stateData);
                //updateData(d, scope.stateData);
                //console.log(scope.stateData);
                // console.log(d3.select(this)[0][0].getAttribute('id'));
                let x = d3.event.x;
                let y = d3.event.y + height / 2;

                let preObj = judgePre(x, y);
                scope.setPre({pre : preObj})

                if (scope.lines != undefined) {
                    drawstrategy (allLines, x, y, d)
                    drawAllLines(allLines);
                 }
              }

            function judgePre (x, y) {
                let pre;
                if (scope.stateData.length === 1) {
                    pre = {x, y}
                } else {
                    pre = scope.stateData[scope.stateData.length - 2];
                }
                return pre;
            }

            function lessThanTwo (allLineData, x, y, d) {
                if (d.id % 2 == 0) {
                    updateFirst (allLineData, x, y);
                } else {
                    updateSecond (allLineData, x, y);
                }
                
            }

            function drawstrategy (allLines, x, y, d) {
                let len = scope.stateData.length;
                if (len <= 2) {
                    lessThanTwo(allLines, x, y, d);
                } else {
                    updateRest(allLines, x, y, d);
                    // updateLast (allLines, x, y, d);
                }
            }

              function drawAllLines (allLines) {
                d3.selectAll('line').remove();
                 allLines.forEach(ele => {
                    svg.append('line')
                    .style('stroke', 'black')
                    .attr("stroke-width", 2)
                    .attr('x1', ele[0].x)
                    .attr('y1', ele[0].y)
                    .attr('x2', ele[1].x)
                    .attr('y2', ele[1].y);
                 })
                
              }
              // the state status comfirmatiom 
              function openPrompt () {
                    bootbox.prompt({
                    title: "Please select your status",
                    inputType: 'select',
                    inputOptions: [
                        {
                            text: 'Success',
                            value: '1',
                        },
                        {
                            text: 'Error',
                            value: '2',
                        },
                        {
                            text: 'Stop',
                            value: '3',
                        },
                        {
                            text: 'Cancel',
                            value: '4',
                        },
                    ],
                    callback: function (result) {
                        scope.getStatus({newSta:result});
                        let success = '1';
                        if (result === success && scope.stateData.length !== 5) {
                            openComfirm();
                        }   
                    }
                });
            }
            // draw lines between two states accrdoing the coordinates in data
            function drawLine () {
                let preObj = scope.stateData[scope.stateData.length - 2];
                //scope.setPre({pre : preObj})
                let lineData = [
                    {x : parseInt(preObj.x) + width, y : parseInt(preObj.y) + height / 2},
                    {x : parseInt(preObj.x) + width * 2, y : parseInt(preObj.y) + height / 2}
                ]

                scope.lines = svg.append('line')
                    .style('stroke', 'black')
                    .attr("stroke-width", 2)
                    .attr('id', 'line-' + preObj.id)
                    .attr('x1', lineData[0].x)
                    .attr('y1', lineData[0].y)
                    .attr('x2', lineData[1].x)
                    .attr('y2', lineData[1].y);

                allLines = [...allLines, lineData];
            }

           

            // the second comfirmation to add 
            function openComfirm () {
                bootbox.confirm("Add another state?", 
                function(result){ 
                    scope.isAdd({toAdd : result});
                    if (result === true) {
                        drawLine();
                    }
                });
            }
        }
    };
 });