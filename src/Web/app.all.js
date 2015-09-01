var Cat;
(function (Cat) {
    var TotalBalanceController = (function () {
        function TotalBalanceController($scope, $http, $location) {
            this._$scope = $scope;
            this._$location = $location;
            this._$http = $http;

            this.init();

            this.loadData();
        }
        TotalBalanceController.prototype.init = function () {
            var _this = this;
            this.periodInMonth = 6;

            this._$scope.showDetails = function (type, year, month) {
                _this.showPeriodDetails(type, year, month);
            };
            this._$scope.openYear = function (d) {
                _this.openYear(d);
            };
            this._$scope.moveBack = function () {
                _this.moveBack();
            };
            this._$scope.moveForward = function () {
                _this.moveForward();
            };
        };

        TotalBalanceController.prototype.loadData = function () {
            var _this = this;
            this._$http.get('balance/dates').success(function (data) {
                if (data == null) {
                    _this.firstDate = new Date();
                    _this.lastDate = new Date();
                } else {
                    _this.firstDate = Cat.StringHelper.parseDate(data.firstDate);
                    _this.lastDate = Cat.StringHelper.parseDate(data.lastDate);
                }

                _this.loadBalance(Cat.DateHelper.addMonth(Cat.DateHelper.toFirstDate(_this.lastDate), 1 - _this.periodInMonth));
                _this.populateBalanceYears();
            });
        };

        TotalBalanceController.prototype.loadBalance = function (dateFrom) {
            var _this = this;
            this.dateFrom = dateFrom;
            var dateTo = Cat.DateHelper.addMonth(dateFrom, this.periodInMonth);

            this._$http.get('balance/' + Cat.StringHelper.dateToString(dateFrom) + "/" + Cat.StringHelper.dateToString(dateTo)).success(function (data) {
                _this._$scope.balance = data;
            });
        };

        TotalBalanceController.prototype.populateBalanceYears = function () {
            var list = [];

            for (var i = this.firstDate.getFullYear(); i <= this.lastDate.getFullYear(); i++) {
                list.push(i);
            }

            this._$scope.balanceYears = list;
        };

        TotalBalanceController.prototype.openYear = function (year) {
            var dateFrom = new Date(year, 0, 1);

            this.loadBalance(dateFrom);
        };

        TotalBalanceController.prototype.moveBack = function () {
            var t = Cat.DateHelper.addMonth(this.dateFrom, -1);

            if (t >= Cat.DateHelper.toFirstDate(this.firstDate))
                this.loadBalance(t);
        };

        TotalBalanceController.prototype.moveForward = function () {
            var t = Cat.DateHelper.addMonth(this.dateFrom, 1);

            if (Cat.DateHelper.addMonth(this.dateFrom, this.periodInMonth) <= Cat.DateHelper.toFirstDate(this.lastDate))
                this.loadBalance(t);
        };

        TotalBalanceController.prototype.showPeriodDetails = function (type, year, month) {
            console.log("show details for " + year + "/" + month + ": " + type);

            var dateFrom = new Date(year, month - 1, 1);
            var dateTo = Cat.DateHelper.addMonth(dateFrom, 1);

            this._$location.path("/balance/" + type + '/' + Cat.StringHelper.dateToString(dateFrom) + "/" + Cat.StringHelper.dateToString(dateTo));
        };
        TotalBalanceController.$inject = [
            '$scope',
            '$http',
            '$location'
        ];
        return TotalBalanceController;
    })();
    Cat.TotalBalanceController = TotalBalanceController;
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var CategorizeRulesController = (function () {
        function CategorizeRulesController($scope, $http, $location) {
            this._$scope = $scope;
            this._$http = $http;
            this._$location = $location;

            this.init();
            this.load();
        }
        CategorizeRulesController.prototype.init = function () {
            var _this = this;
            this._$scope.addRule = function () {
                return _this.addRule();
            };
            this._$scope.edit = function (r) {
                return _this.edit(r);
            };
            this._$scope.remove = function (r) {
                return _this.remove(r);
            };
        };

        CategorizeRulesController.prototype.load = function () {
            var _this = this;
            this._$http.get('categories/categorizeRules').success(function (data) {
                _this._$scope.rules = data;
            });
        };

        CategorizeRulesController.prototype.edit = function (rule) {
            this._$location.path("categorizeRules/edit/" + rule.id);
        };

        CategorizeRulesController.prototype.remove = function (rule) {
            var _this = this;
            this._$http.delete('categories/categorizeRules/' + rule.id).success(function (data) {
                _this._$http.get('categories/categorizeRules').success(function (data) {
                    _this._$scope.rules = data;
                });
            });
        };

        CategorizeRulesController.prototype.addRule = function () {
            this._$location.path("categorizeRules/edit/");
        };
        CategorizeRulesController.$inject = [
            '$scope',
            '$http',
            '$location'
        ];
        return CategorizeRulesController;
    })();
    Cat.CategorizeRulesController = CategorizeRulesController;
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var PeriodSubcategoryController = (function () {
        function PeriodSubcategoryController($scope, $http, $location, $routeParams) {
            this.$scope = $scope;
            this.$http = $http;
            this.$location = $location;
            this.$routeParams = $routeParams;
            this._$scope = $scope;
            this._$location = $location;
            this._$http = $http;

            this._$scope.from = $routeParams.from;
            this._$scope.to = $routeParams.to;

            this._$scope.fromDate = Cat.StringHelper.parseDate($routeParams.from);
            this._$scope.toDate = Cat.StringHelper.parseDate($routeParams.to);

            this._$scope.balanceType = $routeParams.balanceType;
            this._$scope.category = $routeParams.category;

            this.init();

            this.load();
        }
        PeriodSubcategoryController.prototype.init = function () {
            var _this = this;
            this._$scope.showDetails = function (d) {
                return _this.showCategoryGroupDetails(d);
            };
        };

        PeriodSubcategoryController.prototype.load = function () {
            var _this = this;
            this._$http.get('balance/' + this._$scope.from + '/' + this._$scope.to + '/' + this._$scope.balanceType + '/' + this._$scope.category).success(function (data) {
                _this._$scope.balance = data;
            });
        };

        PeriodSubcategoryController.prototype.showCategoryGroupDetails = function (d) {
            console.log("show details for category: " + d.subCategoryName);

            this._$location.path("/transactions/" + this._$scope.balanceType + "/" + this._$scope.from + "/" + this._$scope.to + "/" + this._$scope.category + '/' + d.subCategoryName.toLowerCase());
        };
        PeriodSubcategoryController.$inject = [
            '$scope',
            '$http',
            '$location',
            '$routeParams'
        ];
        return PeriodSubcategoryController;
    })();
    Cat.PeriodSubcategoryController = PeriodSubcategoryController;
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var CategorizeRuleController = (function () {
        function CategorizeRuleController($scope, $http, $location, $routeParams) {
            this._$scope = $scope;
            this._$location = $location;
            this._$http = $http;
            this._$routeParams = $routeParams;

            this.init();
            this.load();
        }
        CategorizeRuleController.prototype.init = function () {
            var _this = this;
            this._$scope.id = this._$routeParams.id;

            this._$scope.save = function () {
                return _this.save();
            };
            this._$scope.cancel = function () {
                return _this.cancel();
            };
        };

        CategorizeRuleController.prototype.load = function () {
            var _this = this;
            if (this._$scope.id != null) {
                this._$http.get("categories/categorizeRules/" + this._$scope.id).success(function (data) {
                    _this._$scope.rule = data;
                });
            }

            this._$http.get("categories/categorizeRules/transactionTypes").success(function (data) {
                _this._$scope.types = data;
            });

            this._$http.get("categories").success(function (data) {
                _this._$scope.categories = data;
            });
        };

        CategorizeRuleController.prototype.save = function () {
            var _this = this;
            if (this._$scope.id != null) {
                this._$http.put("categories/categorizeRules/" + this._$scope.id, this._$scope.rule).success(function () {
                    _this._$location.path("categorizeRules/");
                });
            } else {
                this._$http.post("categories/categorizeRules", this._$scope.rule).success(function () {
                    _this._$location.path("categorizeRules/");
                });
            }
        };

        CategorizeRuleController.prototype.cancel = function () {
            this._$location.path("categorizeRules/");
        };
        CategorizeRuleController.$inject = [
            '$scope',
            '$http',
            '$location',
            '$routeParams'
        ];
        return CategorizeRuleController;
    })();
    Cat.CategorizeRuleController = CategorizeRuleController;
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var PeriodCategoryController = (function () {
        function PeriodCategoryController($scope, $http, $location, $routeParams) {
            this.$scope = $scope;
            this.$http = $http;
            this.$location = $location;
            this.$routeParams = $routeParams;
            this._$scope = $scope;
            this._$location = $location;
            this._$http = $http;

            this._$scope.from = $routeParams.from;
            this._$scope.to = $routeParams.to;

            this._$scope.fromDate = Cat.StringHelper.parseDate($routeParams.from);
            this._$scope.toDate = Cat.StringHelper.parseDate($routeParams.to);

            this._$scope.balanceType = $routeParams.balanceType;

            this.init();

            this.load();
        }
        PeriodCategoryController.prototype.init = function () {
            var _this = this;
            this._$scope.showDetails = function (d) {
                return _this.showBalancePerSubCategory(d);
            };
            this._$scope.showTransactions = function (d) {
                return _this.showTransactions(d);
            };
        };

        PeriodCategoryController.prototype.load = function () {
            var _this = this;
            this._$http.get('balance/' + this._$scope.from + '/' + this._$scope.to + '/' + this._$scope.balanceType).success(function (data) {
                _this._$scope.balance = data;
            });
        };

        PeriodCategoryController.prototype.showBalancePerSubCategory = function (d) {
            console.log("show details for category: " + d.categoryName);

            if (d.categoryName.toLowerCase() == 'uncategorized') {
                this._$location.path("/transactions/" + this._$scope.balanceType + "/" + this._$scope.from + "/" + this._$scope.to + "/uncategorized");
            } else {
                this._$location.path("/balance/" + this._$scope.balanceType + "/" + this._$scope.from + "/" + this._$scope.to + "/" + d.categoryName.toLowerCase());
            }
        };

        PeriodCategoryController.prototype.showTransactions = function (d) {
            this._$location.path("/transactions/" + this._$scope.balanceType + "/" + this._$scope.from + "/" + this._$scope.to + "/" + d.categoryName.toLowerCase());
        };
        PeriodCategoryController.$inject = [
            '$scope',
            '$http',
            '$location',
            '$routeParams'
        ];
        return PeriodCategoryController;
    })();
    Cat.PeriodCategoryController = PeriodCategoryController;
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var TransactionsController = (function () {
        function TransactionsController($scope, $http, $location, $routeParams) {
            this.$scope = $scope;
            this.$http = $http;
            this.$location = $location;
            this.$routeParams = $routeParams;
            this._$http = $http;
            this._$scope = $scope;
            this._$location = $location;

            this._$scope.from = $routeParams.from;
            this._$scope.to = $routeParams.to;
            this._$scope.balanceType = $routeParams.balanceType;
            this._$scope.category = $routeParams.category;
            this._$scope.subCategory = $routeParams.subCategory;

            this.init();
            this.load();
        }
        TransactionsController.prototype.init = function () {
            var _this = this;
            this._$scope.categoryRes = null;

            this._$scope.setCategory = function (t) {
                return _this.setCategory(t);
            };
        };

        TransactionsController.prototype.load = function () {
            var _this = this;
            this._$http.get('categories').success(function (data) {
                _this._$scope.categories = data;
            });

            if (this._$scope.category == null) {
                this._$http.get('transactions/uncategorized/' + this._$scope.balanceType + '/' + this._$scope.from + '/' + this._$scope.to).success(function (data) {
                    _this._$scope.transactions = data;
                });
            } else {
                this._$http.get('transactions/' + this._$scope.balanceType + '/' + this._$scope.from + '/' + this._$scope.to + '/' + this._$scope.subCategory).success(function (data) {
                    _this._$scope.transactions = data;
                });
            }
        };

        TransactionsController.prototype.setCategory = function (t) {
            console.log("change category for transaction = " + t.id + " to " + t.subCategory.name);

            this._$http.post('transactions/' + t.id + '/updateCategory', t.subCategory.id).success(function (data) {
                console.log("category for transaction = " + t.id + " was updated successfully");
            }).error(function (data) {
                console.log("error occured while updating category for transaction = " + t.id);
            });
        };
        TransactionsController.$inject = [
            '$scope',
            '$http',
            '$location',
            '$routeParams'
        ];
        return TransactionsController;
    })();
    Cat.TransactionsController = TransactionsController;
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var UploadController = (function () {
        function UploadController($scope) {
            this.$scope = $scope;
            this._$scope = $scope;

            this.init();
        }
        UploadController.prototype.init = function () {
            var _this = this;
            this._$scope.uploadFile = function () {
                return _this.uploadFile();
            };
        };

        UploadController.prototype.uploadFile = function () {
            console.log("upload file");

            var el = $("uploadInpt");
            el.click();
            //angular.element().click();
        };
        UploadController.$inject = [
            '$scope'
        ];
        return UploadController;
    })();
    Cat.UploadController = UploadController;
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    (function (Directives) {
        angular.module('cat.filters', []).filter('firstupperletter', function () {
            return function (input) {
                if (input == null || input.length == 0)
                    return input;
                return input.substr(0, 1).toUpperCase() + input.substr(1);
            };
        });
    })(Cat.Directives || (Cat.Directives = {}));
    var Directives = Cat.Directives;
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    (function (Directives) {
        var UploadDirective = (function () {
            function UploadDirective($http) {
                var _this = this;
                this.restrict = "A";
                this.scope = {
                    data: '='
                };
                this._$http = $http;

                this.link = function (scope, element, attrs) {
                    var input = angular.element("<input type='file' style='display:none'/>");
                    input.bind('change', function () {
                        var t = input[0];

                        if (t.files != null && t.files.length > 0)
                            _this.upload(t.files[0]);
                    });

                    element.parent().append(input);

                    element.bind('click', function () {
                        console.log("upload-click");

                        input[0].click();
                    });
                };
            }
            UploadDirective.factory = function () {
                var directive = function ($http) {
                    return new UploadDirective($http);
                };

                directive['$inject'] = ['$http'];

                return directive;
            };

            UploadDirective.prototype.upload = function (file) {
                console.log('uploading file: ' + file.name);

                var formData = new FormData();
                formData.append('file', file);
                this._$http.post("transactions/upload", formData, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).success(function () {
                    console.log("file was uploaded successfully");
                }).error(function () {
                    console.log("error occured during file upload");
                });
            };
            return UploadDirective;
        })();
        Directives.UploadDirective = UploadDirective;
        function upload() {
            return {
                restrict: 'A',
                scope: {
                    data: '='
                },
                link: function (scope, element, attrs) {
                    var input = angular.element("<input type='file' style='display:none'/>");
                    element.parent().append(input);

                    element.bind('click', function () {
                        console.log("upload-click");

                        input[0].click();
                    });
                }
            };
        }
        Directives.upload = upload;
    })(Cat.Directives || (Cat.Directives = {}));
    var Directives = Cat.Directives;
})(Cat || (Cat = {}));
var Cat;
(function (Cat) {
    var StringHelper = (function () {
        function StringHelper() {
        }
        StringHelper.dateToString = function (d) {
            return d.getFullYear().toString() + this.numToString(d.getMonth() + 1, 2) + this.numToString(d.getDate(), 2);
        };

        StringHelper.parseDate = function (d) {
            if (d.length == 8)
                return new Date(parseInt(d.substr(0, 4)), parseInt(d.substr(4, 2)) - 1, parseInt(d.substr(6, 2)));

            return new Date(d);
        };

        StringHelper.numToString = function (n, length) {
            var res = n.toString();

            if (length - res.length > 0) {
                var zeros = new Array(length - res.length + 1).join("0");
                return zeros + res;
            }

            return res;
        };
        return StringHelper;
    })();
    Cat.StringHelper = StringHelper;

    var DateHelper = (function () {
        function DateHelper() {
        }
        DateHelper.toFirstDate = function (date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        };

        DateHelper.addMonth = function (date, monthes, firstDate) {
            if (typeof firstDate === "undefined") { firstDate = false; }
            var d = firstDate ? 1 : date.getDate();
            var m = date.getMonth() + monthes;

            if (m >= 0 && m < 12) {
                return new Date(date.getFullYear(), m, d);
            }

            if (m >= 12) {
                return new Date(date.getFullYear() + 1, m - 12, d);
            }

            if (m < 0) {
                return new Date(date.getFullYear() - 1, 12 + m, d);
            }
        };
        return DateHelper;
    })();
    Cat.DateHelper = DateHelper;
})(Cat || (Cat = {}));
var d3;
(function (_d3) {
    'use strict';

    var d3PieDirective = (function () {
        function d3PieDirective($window, $timeout, d3Service) {
            var _this = this;
            this.restrict = "EA";
            this.scope = {
                data: '=',
                label: '@',
                onClick: '&'
            };
            this._$window = $window;
            this._$timeout = $timeout;
            this._d3Service = d3Service;

            this.link = function (scope, element, attrs) {
                d3Service.d3().then(function (d3) {
                    _this._d3 = d3;

                    _this._width = parseInt(attrs.chartSize) || 600;
                    _this._height = (parseInt(attrs.chartSize) || 600) - 100;
                    _this._valueField = attrs.valuefield;
                    _this._textFileld = attrs.textfield;

                    var min = _this._width / 2;
                    _this._outerRadius = min - 120;
                    _this._innerRadius = 30;
                    _this._labelRadius = min - 80;
                    _this._lineRadius = _this._outerRadius - 20;

                    _this._color = _this._d3.scale.category10();

                    _this._svg = d3.select(element[0]).append("svg").attr("width", _this._width).attr("height", _this._height).attr("class", "pie-chart").append("g").attr("transform", "translate(" + _this._width / 2 + "," + _this._height / 2 + ")");

                    scope.$watch('data', function (newData) {
                        scope.render(newData);
                    }, true);

                    scope.render = function (data) {
                        _this.renderPie(data, scope);
                    };
                });
            };
        }
        d3PieDirective.factory = function () {
            var directive = function ($window, $timeout, d3Service) {
                return new d3PieDirective($window, $timeout, d3Service);
            };

            directive['$inject'] = ['$window', '$timeout', 'd3Service'];

            return directive;
        };

        d3PieDirective.prototype.renderPie = function (data, scope) {
            var _this = this;
            this._svg.selectAll('*').remove();

            if (!data)
                return;
            if (this._renderTimeout)
                clearTimeout(this._renderTimeout);

            this._renderTimeout = this._$timeout(function () {
                var arc = _this._d3.svg.arc().outerRadius(_this._outerRadius).innerRadius(_this._innerRadius);

                var pie = _this._d3.layout.pie().sort(null).value(function (d) {
                    return d[_this._valueField];
                });

                _this.renderArcs(data, pie, arc, scope);

                _this.renderLabels(data, pie, arc);
            }, 200);
        };

        d3PieDirective.prototype.renderArcs = function (data, pie, arc, scope) {
            var _this = this;
            var g = this._svg.append("g").attr("class", "arcs").selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc").on('click', function (d) {
                scope.onClick({ item: d.data });
                scope.$apply();
            });

            g.append("path").attr("d", arc).style("fill", function (d) {
                return _this._color(d.data[_this._textFileld]);
            });
        };

        d3PieDirective.prototype.renderLabels = function (data, pie, arc) {
            var _this = this;
            var labelGroups = this._svg.append("g").attr("class", "labels").selectAll(".label").data(pie(data)).enter().append("g").attr("class", "label");

            var fx = function (d, r) {
                var centroid = arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var x = Math.cos(midAngle) * r;
                return x;
            };

            var fy = function (d, r) {
                var centroid = arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var y = Math.sin(midAngle) * r;
                return y;
            };

            labelGroups.append("circle").attr({
                x: 0,
                y: 0,
                r: 2,
                fill: "#000",
                transform: function (d, i) {
                    var x = fx(d, _this._lineRadius);
                    var y = fy(d, _this._lineRadius);
                    return "translate(" + x + ", " + y + ")";
                },
                'class': "label-circle"
            });

            var textLines = labelGroups.append("line").attr({
                x1: function (d) {
                    return fx(d, _this._lineRadius);
                },
                y1: function (d) {
                    return fy(d, _this._lineRadius);
                },
                x2: function (d) {
                    return fx(d, _this._labelRadius);
                },
                y2: function (d) {
                    return fy(d, _this._labelRadius);
                },
                'class': "label-line"
            });

            var textX = function (d, i) {
                var centroid = arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var x = Math.cos(midAngle) * _this._labelRadius;
                var sign = (x > 0) ? 1 : -1;
                var labelX = x + (5 * sign);
                return labelX;
            };
            var textY = function (d, i) {
                var centroid = arc.centroid(d);
                var midAngle = Math.atan2(centroid[1], centroid[0]);
                var y = Math.sin(midAngle) * _this._labelRadius;
                return y;
            };

            var textLabels = labelGroups.append("text").attr({
                x: textX,
                y: textY,
                transform: function (d, i) {
                    var x = textX(d, i);
                    var y = textY(d, i);
                    return "translate(" + x + ", " + y + ")";
                },
                'text-anchor': function (d, i) {
                    var centroid = arc.centroid(d);
                    var midAngle = Math.atan2(centroid[1], centroid[0]);
                    var x = Math.cos(midAngle);
                    return (x > 0) ? "start" : "end";
                },
                'class': 'label-text'
            });

            textLabels.append("tspan").attr({
                x: 0,
                y: 0
            }).text(function (d) {
                return d.data[_this._textFileld];
            });

            textLabels.append("tspan").attr({
                x: 0,
                y: 0,
                dy: "1.1em"
            }).text(function (d) {
                return "€ " + _this._d3.format(',')(d.data[_this._valueField]);
            });

            this.relax(textLabels, textLines);
        };

        d3PieDirective.prototype.relax = function (textLabels, textLines) {
            var spacing = 0;
            var alpha = 2;

            var d3Service = this._d3;
            var again = false;
            var _this = this;

            textLabels.each(function (d, i) {
                var a = this;
                var da = d3Service.select(a);
                var y1 = da.attr("y");

                spacing = da.node().getBBox().height + 5;

                textLabels.each(function (d, j) {
                    var b = this;

                    // a & b are the same element and don't collide.
                    if (a == b)
                        return;
                    var db = d3Service.select(b);

                    // a & b are on opposite sides of the chart and
                    // don't collide
                    if (da.attr("text-anchor") != db.attr("text-anchor"))
                        return;

                    // Now let's calculate the distance between
                    // these elements.
                    var y2 = db.attr("y");
                    var deltaY = y1 - y2;

                    // Our spacing is greater than our specified spacing,
                    // so they don't collide.
                    if (Math.abs(deltaY) > spacing)
                        return;

                    // If the labels collide, we'll push each
                    // of the two labels up and down a little bit.
                    again = true;

                    var sign = deltaY > 0 ? 1 : -1;
                    var adjust = sign * alpha;
                    ;

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
                textLines.attr("y2", function (d, i) {
                    var labelForLine = d3Service.select(labelElements[i]);
                    return labelForLine.attr("y");
                });
                setTimeout(function () {
                    return _this.relax(textLabels, textLines);
                }, 1);
            }
        };

        d3PieDirective.prototype.destruct = function () {
            this._$window = null;
            this._$timeout = null;
            this._d3Service = null;

            this._d3 = null;
            this._svg = null;
            this._renderTimeout = null;
        };
        return d3PieDirective;
    })();
    _d3.d3PieDirective = d3PieDirective;
})(d3 || (d3 = {}));
/// <reference path="d3.piechart.ts" />
var d3;
(function (_d3) {
    function d3Bars($window, $timeout, d3Service) {
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                label: '@',
                onClick: '&'
            },
            link: function (scope, element, attrs) {
                d3Service.d3().then(function (d3) {
                    var renderTimeout;

                    var margin = { top: 20, right: 20, bottom: 50, left: 40 };

                    var totalHeight = parseInt(attrs.chartHeight) || 300;
                    var totalWidth = parseInt(attrs.chartWidth) || 500;

                    var svg = d3.select(element[0]).append('svg').style('height', totalHeight + 'px').style('width', totalWidth + 'px').attr("class", "balance").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    scope.$watch('data', function (newData) {
                        scope.render(newData);
                    }, true);

                    scope.render = function (data) {
                        svg.selectAll('*').remove();

                        if (!data)
                            return;
                        if (renderTimeout)
                            clearTimeout(renderTimeout);

                        renderTimeout = $timeout(function () {
                            var width = totalWidth - margin.left - margin.right;
                            var height = totalHeight - margin.top - margin.bottom;

                            var color = d3.scale.ordinal().range(["#ff8c00", "#8a89a6"]);

                            var xScale = d3.scale.ordinal().domain(data.map(function (d) {
                                return d.period;
                            })).rangeRoundBands([0, width], .1);

                            var x1Scale = d3.scale.ordinal().domain(["debit", "credit"]).rangeRoundBands([0, xScale.rangeBand()]);

                            var yScale = d3.scale.linear().domain([0, d3.max(data, function (d) {
                                    return Math.max(d.debit, d.credit);
                                })]).range([height, 0]);

                            var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                            var yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(d3.format(".2s"));

                            svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

                            svg.append("g").attr("class", "y axis").call(yAxis);

                            var periods = svg.selectAll('.period').data(data).enter().append('g').attr("class", "g").attr("transform", function (d) {
                                return "translate(" + xScale(d.period) + ", 0)";
                            });

                            var bars = periods.selectAll('rect').data(function (d) {
                                return [
                                    { type: 'debit', value: d.debit, period: d.period, year: d.year, month: d.month },
                                    { type: 'credit', value: d.credit, period: d.period, year: d.year, month: d.month }
                                ];
                            }).enter().append('rect').on('click', function (d) {
                                scope.onClick({ item: d });
                                scope.$apply();
                            }).attr('width', x1Scale.rangeBand()).attr('x', function (d) {
                                return x1Scale(d.type);
                            }).attr('y', function (d) {
                                return yScale(d.value);
                            }).attr("height", function (d) {
                                return height - yScale(d.value);
                            }).attr('fill', function (d) {
                                return color(d.type);
                            }).attr("class", "bar");

                            bars.append('title').text(function (d) {
                                return d3.format(',')(d.value);
                            });

                            /*bars.transition()
                            .duration(1000)
                            .attr('y', d => yScale(d.value))
                            .attr("height", d => height - yScale(d.value))
                            ;*/
                            var legend = svg.selectAll(".legend").data(["debit", "credit"]).enter().append("g").attr("class", "legend").attr("transform", function (d, i) {
                                return "translate(" + (width / 2 + i * 60) + ", -" + margin.top + ")";
                            });

                            legend.append("rect").attr("x", 5).attr("y", 0).attr("width", 16).attr("height", 16).style("fill", color);

                            legend.append("text").attr("x", 0).attr("y", 7).attr("dy", ".35em").style("text-anchor", "end").text(function (d) {
                                return d;
                            });
                        }, 200);
                    };
                });
            }
        };
    }
    _d3.d3Bars = d3Bars;
})(d3 || (d3 = {}));
/// <reference path="d3.barchart.ts" />
/// <reference path="d3.piechart.ts" />
var d3;
(function (d3) {
    angular.module('d3.directives', ['d3']).directive('d3Bars', [
        '$window', '$timeout', 'd3Service',
        d3.d3Bars
    ]).directive('d3Pie', [
        '$window', '$timeout', 'd3Service',
        d3.d3PieDirective.factory()
    ]);
})(d3 || (d3 = {}));
var d3;
(function (_d3) {
    angular.module('d3', []).factory('d3Service', [
        '$document', '$q', '$rootScope',
        function ($document, $q, $rootScope) {
            var d = $q.defer();

            function onScriptLoad() {
                // Load client in the browser
                $rootScope.$apply(function () {
                    var w = window;
                    d.resolve(w.d3);
                });
            }

            // Create a script tag with d3 as the source
            // and call our onScriptLoad callback when it
            // has been loaded
            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = 'content/libs/d3/d3.min.js';
            scriptTag.onreadystatechange = function () {
                if (this.readyState == 'complete')
                    onScriptLoad();
            };

            scriptTag.onload = onScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);

            return {
                d3: function () {
                    return d.promise;
                }
            };
        }]);
})(d3 || (d3 = {}));
/// <reference path="upload.ts" />
var Cat;
(function (Cat) {
    (function (Directives) {
        angular.module('cat.directives', []).directive('catUpload', Cat.Directives.UploadDirective.factory());
    })(Cat.Directives || (Cat.Directives = {}));
    var Directives = Cat.Directives;
})(Cat || (Cat = {}));
/// <reference path="../../libs/typings/jquery/jquery.d.ts" />
/// <reference path="../../libs/typings/angularjs/angular.d.ts" />
/// <reference path="../_lib.ts" />
/// <reference path="d3/d3.ts" />
/// <reference path="d3/d3.directives.ts" />
/// <reference path="../directives/directives.bootstrap.ts" />
var Cat;
(function (Cat) {
    angular.module('financeApp', [
        'ngRoute', 'ngSanitize',
        'ui.select', 'ui.bootstrap',
        'd3', 'd3.directives',
        'cat.directives', 'cat.filters'
    ]).controller('uploadCtrl', Cat.UploadController).controller('categorizeRulesCtrl', Cat.CategorizeRulesController).controller('categorizeRuleCtrl', Cat.CategorizeRuleController).controller('totalBalanceCtrl', Cat.TotalBalanceController).controller('periodCategoryCtrl', Cat.PeriodCategoryController).controller('periodSubcategoryCtrl', Cat.PeriodSubcategoryController).controller('transactionsCtrl', Cat.TransactionsController).config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: Cat.appSettings.viewRootPath + 'totalBalanceView.html',
                controller: 'totalBalanceCtrl'
            }).when('/balance/:balanceType/:from/:to', {
                templateUrl: Cat.appSettings.viewRootPath + 'periodCategoryView.html',
                controller: 'periodCategoryCtrl'
            }).when('/balance/:balanceType/:from/:to/:category', {
                templateUrl: Cat.appSettings.viewRootPath + 'periodSubcategoryView.html',
                controller: 'periodSubcategoryCtrl'
            }).when('//:category/:balanceType/:from/:to', {
                templateUrl: Cat.appSettings.viewRootPath + 'periodSubcategoryView.html',
                controller: 'periodSubcategoryCtrl'
            }).when('//:category/:balanceType/:from/:to', {
                templateUrl: Cat.appSettings.viewRootPath + 'periodSubcategoryView.html',
                controller: 'periodSubcategoryCtrl'
            }).when('/transactions/:balanceType/:from/:to/:category/:subCategory', {
                templateUrl: Cat.appSettings.viewRootPath + 'transactionList.html',
                controller: 'transactionsCtrl'
            }).when('/transactions/:balanceType/:from/:to/uncategorized', {
                templateUrl: Cat.appSettings.viewRootPath + 'transactionList.html',
                controller: 'transactionsCtrl'
            }).when('/categorizeRules', {
                templateUrl: Cat.appSettings.viewRootPath + 'categorizeRuleList.html',
                controller: 'categorizeRulesCtrl'
            }).when('/categorizeRules/edit', {
                templateUrl: Cat.appSettings.viewRootPath + 'categorizeRuleEdit.html',
                controller: 'categorizeRuleCtrl'
            }).when('/categorizeRules/edit/:id', {
                templateUrl: Cat.appSettings.viewRootPath + 'categorizeRuleEdit.html',
                controller: 'categorizeRuleCtrl'
            }).otherwise({
                redirectTo: '/'
            });
        }]);
    Cat.appSettings = {
        viewRootPath: "./content/app/views/"
    };
})(Cat || (Cat = {}));
//# sourceMappingURL=app.all.js.map
