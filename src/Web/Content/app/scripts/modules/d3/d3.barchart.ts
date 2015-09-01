/// <reference path="d3.piechart.ts" />

module d3 {
     export function d3Bars($window, $timeout, d3Service) {
                 return {
             restrict: 'EA',
             scope: {
                 data: '=',
                 label: '@',
                 onClick: '&'
             },
             link: (scope, element, attrs) => {
                 d3Service.d3().then(d3 => {

                     var renderTimeout;

                     var margin = { top: 20, right: 20, bottom: 50, left: 40 };

                     var totalHeight = parseInt(attrs.chartHeight) || 300;
                     var totalWidth = parseInt(attrs.chartWidth) || 500;

                     var svg = d3.select(element[0])
                         .append('svg')
                         .style('height', totalHeight + 'px')
                         .style('width', totalWidth + 'px')
                         .attr("class", "balance")
                         .append("g")
                         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                     scope.$watch('data', newData => {
                         scope.render(newData);
                     }, true);

                     scope.render = data => {
                         svg.selectAll('*').remove();

                         if (!data) return;
                         if (renderTimeout) clearTimeout(renderTimeout);

                         renderTimeout = $timeout(() => {

                             var width = totalWidth - margin.left - margin.right;
                             var height = totalHeight - margin.top - margin.bottom;

                             var color = d3.scale.ordinal()
                                 .range(["#ff8c00", "#8a89a6"]);

                             var xScale = d3.scale.ordinal()
                                 .domain(data.map(d => d.period))
                                 .rangeRoundBands([0, width], .1);

                             var x1Scale = d3.scale.ordinal()
                                 .domain(["debit", "credit"])
                                 .rangeRoundBands([0, xScale.rangeBand()]);

                             var yScale = d3.scale.linear()
                                 .domain([0, d3.max(data, d => Math.max(d.debit, d.credit))])
                                 .range([height, 0]);

                             var xAxis = d3.svg.axis()
                                 .scale(xScale)
                                 .orient("bottom");

                             var yAxis = d3.svg.axis()
                                 .scale(yScale)
                                 .orient("left")
                                 .tickFormat(d3.format(".2s"));

                             svg.append("g")
                                 .attr("class", "x axis")
                                 .attr("transform", "translate(0," + height + ")")
                                 .call(xAxis);

                             svg.append("g")
                                 .attr("class", "y axis")
                                 .call(yAxis)
                             ;

                             var periods = svg.selectAll('.period')
                                 .data(data)
                                 .enter()
                                 .append('g')
                                 .attr("class", "g")
                                 .attr("transform", d => "translate(" + xScale(d.period) + ", 0)")
                             ;

                             var bars = periods.selectAll('rect')
                                 .data(d => [
                                     { type: 'debit', value: d.debit, period: d.period, year: d.year, month: d.month },
                                     { type: 'credit', value: d.credit, period: d.period, year: d.year, month: d.month }
                                 ])
                                 .enter()
                                 .append('rect')
                                 .on('click', d => {
                                     scope.onClick({ item: d });
                                     scope.$apply();
                                 })
                                 .attr('width', x1Scale.rangeBand())
                                 .attr('x', d => x1Scale(d.type))
                                 //.attr('y', height)
                                 .attr('y', d => yScale(d.value))
                                 //.attr("height", 0)
                                 .attr("height", d => height - yScale(d.value))
                                 .attr('fill', d => color(d.type))
                                 .attr("class", "bar");

                             bars
                                 .append('title')
                                 .text(d => d3.format(',')(d.value));

                             /*bars.transition()
                                 .duration(1000)
                                 .attr('y', d => yScale(d.value))
                                 .attr("height", d => height - yScale(d.value))
                             ;*/

                            var legend = svg.selectAll(".legend")
                                 .data(["debit", "credit"])
                                 .enter().append("g")
                                 .attr("class", "legend")
                                 .attr("transform", (d, i) => "translate(" + (width / 2 + i * 60) + ", -" + margin.top +")");

                             legend.append("rect")
                                 .attr("x", 5)
                                 .attr("y", 0)
                                 .attr("width", 16)
                                 .attr("height", 16)
                                 .style("fill", color);

                             legend.append("text")
                                 .attr("x", 0)
                                 .attr("y", 7)
                                 .attr("dy", ".35em")
                                 .style("text-anchor", "end")
                                 .text(d => d);

                         }, 200);
                     };
                 });
             }
         }
             }
 }