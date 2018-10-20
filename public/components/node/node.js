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
            scope.internalControl = scope.control || {};
            let d3 = $window.d3;
            let rawSvg = elem.find('svg');
            let svg = d3.select(rawSvg[0]);
            scope.currEle = null;
        
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
                  .attr("width", 50)
                  .attr("height", 50)
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("fill", 'blue')
                  .on ("click", function () {
                    if (d3.event.defaultPrevented) {
                        return;
                    }
                    //d3.select(this).attr('fill', 'orange');
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

              function dragmove(d) {
                d3.select(this)
                    .attr("x", d3.event.x)
                    .attr("y", d3.event.y);
                // let x = d3.event.x;
                // let y = d3.event.y + 50;
                // d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
                // if (d3.select(this).attr("id") == "box-1") {
                //     line.attr("x1", x);
                //     line.attr("y1", y);
                // } 
            
              }

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
                            //scope.currEle.attr('fill', 'orange');
                            openComfirm();
                        }   
                    }
                });
            }
            function openComfirm () {
                bootbox.confirm("Add another state?", 
                function(result){ 
                    scope.isAdd({toAdd : result});
                });
            }
        }
    };
 });