module d3 {
    'use strict';

    export interface d3PieScope extends ng.IScope{
        render: Function;
    }

    export class d3PieDirective {
        public restrict = "EA";
        public scope = {
            data: '=',
            label: '@',
            onClick: '&'
        };

        public link: (scope: d3PieScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

        private _$window;
        private _$timeout;
        private _d3Service;

        private _d3;
        private _svg;
        private _renderTimeout;
        
        private _width;
        private _height;
        private _innerRadius;
        private _outerRadius;
        private _labelRadius;
        private _lineRadius;
        private _color;

        private _valueField;
        private _textFileld;
        
        constructor($window, $timeout, d3Service) {
            this._$window = $window;
            this._$timeout = $timeout;
            this._d3Service = d3Service;

            this.link = (scope: d3PieScope, element: ng.IAugmentedJQuery, attrs) => {
                d3Service.d3().then(d3 => {

                    this._d3 = d3;

                    this._width = parseInt(attrs.chartSize) || 600;
                    this._height = (parseInt(attrs.chartSize) || 600) - 100;
                    this._valueField = attrs.valuefield;
                    this._textFileld = attrs.textfield;

                    var min = this._width / 2 ;//Math.min(this._width, this._height) / 2;
                    this._outerRadius = min - 120;
                    this._innerRadius = 30;
                    this._labelRadius = min - 80;
                    this._lineRadius = this._outerRadius - 20;

                    this._color = this._d3.scale.category10();

                    this._svg = d3.select(element[0])
                        .append("svg")
                        .attr("width", this._width)
                        .attr("height", this._height)
                        .attr("class", "pie-chart")
                        .append("g")
                        .attr("transform", "translate(" + this._width / 2 + "," + this._height / 2 + ")");

                    scope.$watch('data', newData => {
                        scope.render(newData);
                    }, true);

                    scope.render = data => { this.renderPie(data, scope); };
                });
            };
        }

        public static factory() {
            var directive = ($window : ng.IWindowService, $timeout: ng.ITimeoutService, d3Service) => {
                return new d3PieDirective($window, $timeout, d3Service);
            };

            directive['$inject'] = ['$window', '$timeout', 'd3Service'];

            return directive;
        }

        private renderPie(data, scope) {
            this._svg.selectAll('*').remove();

            if (!data) return;
            if (this._renderTimeout) clearTimeout(this._renderTimeout);

            this._renderTimeout = this._$timeout(() => {
                var arc = this._d3.svg.arc()
                    .outerRadius(this._outerRadius)
                    .innerRadius(this._innerRadius);

                var pie = this._d3.layout.pie()
                    .sort(null)
                    .value(d => d[this._valueField]);

                this.renderArcs(data, pie, arc, scope);

                this.renderLabels(data, pie, arc);

            }, 200);
        }

        private renderArcs(data, pie, arc, scope) {
            var g = this._svg
                .append("g")
                .attr("class", "arcs")
                .selectAll(".arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc")
                .on('click', d => {
                    scope.onClick({ item: d.data });
                    scope.$apply();
                });

            g.append("path")
                .attr("d", arc)
                .style("fill", d => this._color(d.data[this._textFileld]));
        }

        private renderLabels(data, pie, arc) {
            var labelGroups = this._svg
                .append("g")
                .attr("class", "labels")
                .selectAll(".label")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "label");
            
            var fx = (d, r) => {
                var centroid = arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var x = Math.cos(midAngle) * r;
                return x;
            };

            var fy = (d, r) => {
                var centroid = arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var y = Math.sin(midAngle) * r;
                return y;
            };

            labelGroups
                .append("circle")
                .attr({
                    x: 0,
                    y: 0,
                    r: 2,
                    fill: "#000",
                    transform: (d, i) => {
                        var x = fx(d, this._lineRadius);
                        var y = fy(d, this._lineRadius);
                        return "translate(" + x + ", " + y + ")";
                    },
                    'class': "label-circle"
                });

            var textLines = labelGroups.append("line").attr({
                x1: (d) => { return fx(d, this._lineRadius); },
                y1: (d) => { return fy(d, this._lineRadius); },
                x2: (d) => { return fx(d, this._labelRadius); },
                y2: (d) => { return fy(d, this._labelRadius); },
                'class': "label-line"
            });

            var textX = (d, i) => {
                var centroid = arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var x = Math.cos(midAngle) * this._labelRadius;
                var sign = (x > 0) ? 1 : -1;
                var labelX = x + (5 * sign);
                return labelX;
            };
            var textY = (d, i) => {
                var centroid = arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var y = Math.sin(midAngle) * this._labelRadius;
                return y;
            };

            var textLabels = labelGroups
                .append("text")
                .attr({
                    x: textX,
                    y: textY,
                    transform: (d, i) => {
                        var x = textX(d, i);
                        var y = textY(d, i);
                        return "translate(" + x + ", " + y + ")";
                    },
                    'text-anchor': (d, i) => {
                        var centroid = arc.centroid(d);
                        var midAngle = Math.atan2(centroid[1], centroid[0]);
                        var x = Math.cos(midAngle);
                        return (x > 0) ? "start" : "end";
                    },
                    'class': 'label-text'
                });

            textLabels.append("tspan")
                .attr({
                    x: 0,
                    y: 0
                })
                .text(d => d.data[this._textFileld]);

            textLabels.append("tspan")
                .attr({
                    x: 0,
                    y: 0,
                    dy: "1.1em"
                })
                .text(d => "€ " + this._d3.format(',')(d.data[this._valueField]));

            this.relax(textLabels, textLines);
        }

        private relax(textLabels: any, textLines: any) {

            var spacing = 0;
            var alpha = 2; // step

            var d3Service = this._d3;
            var again = false;
            var _this = this;

            textLabels.each(function(d, i) {

                var a = this;
                var da = d3Service.select(a);
                var y1 = da.attr("y");

                spacing = da.node().getBBox().height + 5;

                textLabels.each(function(d, j) {
                    var b = this;
                    // a & b are the same element and don't collide.
                    if (a == b) return;
                    var db = d3Service.select(b);
                    // a & b are on opposite sides of the chart and
                    // don't collide
                    if (da.attr("text-anchor") != db.attr("text-anchor")) return;
                    // Now let's calculate the distance between
                    // these elements. 
                    var y2 = db.attr("y");
                    var deltaY = y1 - y2;

                    // Our spacing is greater than our specified spacing,
                    // so they don't collide.
                    if (Math.abs(deltaY) > spacing) return;

                    // If the labels collide, we'll push each 
                    // of the two labels up and down a little bit.
                    again = true;

                    var sign = deltaY > 0 ? 1 : -1;
                    var adjust = sign * alpha;;

                    da.attr("y", +y1 + adjust);
                    da.attr("transform", "translate(" + da.attr("x") + ", " + da.attr("y") + ")");
                    db.attr("y", +y2 - adjust);
                    db.attr("transform", "translate(" + db.attr("x") + ", " + db.attr("y") + ")");
                });
            });
            // Adjust our line leaders here
            // so that they follow the labels. 
            if (again) {
                var labelElements = textLabels[0];
                textLines.attr("y2", (d, i) => {
                    var labelForLine = d3Service.select(labelElements[i]);
                    return labelForLine.attr("y");
                });
                setTimeout(() => _this.relax(textLabels, textLines), 1);
            }
        }

        private destruct() {
            this._$window = null;
            this._$timeout = null;
            this._d3Service = null;

            this._d3 = null;
            this._svg = null;
            this._renderTimeout = null;
        }
    }
 }