flowApp.directive('node', function($window){
    return{
       restrict:'EA',
       scope : {
        stateData : '=',
        getStatus : '&',
        isAdd : '&',
        control : '='
      },
      template:"<svg width='1200' height='500'></svg>",
        link: function(scope, elem){
            // export component scope to controller
            scope.internalControl = scope.control || {};
            // initialize d3 and svg
            let d3 = $window.d3;
            let rawSvg = elem.find('svg');
            let svg = d3.select(rawSvg[0]);
            scope.currEle = null;

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
                    .attr("height", 0)
                    .attr("width", 0)
                    .remove();
              }
              // according to id set the class for drag feature
              function setClass (id) {
                if ( id % 2 == 0) {
                    return 'first';
                } else {
                    return 'second';
                }
              }

              function dragmove(d) {
                d3.select(this)
                    .attr("x", d3.event.x)
                    .attr("y", d3.event.y);

                let x = d3.event.x;
                let y = d3.event.y;

                if (scope.lines != undefined) {
                    if (d3.select(this).attr('class') === 'first') {
                        scope.lines.attr("x1", x);
                        scope.lines.attr("y1", y);
                    } else {
                        scope.lines.attr("x2", x);
                        scope.lines.attr("y2", y);
                    }
                 }
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
                        if (result === success) {
                            openComfirm();
                        }   
                    }
                });
            }
            // draw lines between two states accrdoing the coordinates in data
            function drawLine () {
                let preObj = scope.stateData[scope.stateData.length - 2];
                let lineData = [
                    {x : parseInt(preObj.x) + 50, y : 25},
                    {x : parseInt(preObj.x) + 100, y : 25},
                ]
                scope.lines = svg.append('line')
                    .style('stroke', 'black')
                    .attr("stroke-width", 2)
                    .attr('id', 'line-' + preObj.id)
                    .attr('x1', lineData[0].x)
                    .attr('y1', lineData[0].y)
                    .attr('x2', lineData[1].x)
                    .attr('y2', lineData[1].y);
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