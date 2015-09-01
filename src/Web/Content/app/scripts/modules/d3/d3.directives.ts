/// <reference path="d3.barchart.ts" />
/// <reference path="d3.piechart.ts" />

module d3 {
     angular.module('d3.directives', ['d3'])
         .directive('d3Bars', [
             '$window', '$timeout', 'd3Service',
             d3.d3Bars
         ])
         .directive('d3Pie', [
             '$window', '$timeout', 'd3Service',
             d3.d3PieDirective.factory()
         ]);
}