/// <reference path="../_lib.ts" />
/// <reference path="d3/d3.ts" />
/// <reference path="d3/d3.directives.ts" />

/// <reference path="../directives/directives.bootstrap.ts" />

module Cat {
    angular.module('financeApp', [
            'ngRoute', 'ngSanitize',
            'ui.select', 'ui.bootstrap',
            'd3', 'd3.directives',
            'cat.directives', 'cat.filters'
        ])
        .controller('uploadCtrl', UploadController)

        .controller('categorizeRulesCtrl', CategorizeRulesController)
        .controller('categorizeRuleCtrl', CategorizeRuleController)

        .controller('totalBalanceCtrl', TotalBalanceController)
        .controller('periodCategoryCtrl', PeriodCategoryController)
        .controller('periodSubcategoryCtrl', PeriodSubcategoryController)

        .controller('transactionsCtrl', TransactionsController)    

        .config(['$routeProvider', $routeProvider => {
            $routeProvider
                .when('/', {
                    templateUrl: appSettings.viewRootPath + 'totalBalanceView.html',
                    controller: 'totalBalanceCtrl'
                })
                .when('/balance/:balanceType/:from/:to', {
                    templateUrl: appSettings.viewRootPath + 'periodCategoryView.html',
                    controller: 'periodCategoryCtrl'
                })
                .when('/balance/:balanceType/:from/:to/:category', {
                    templateUrl: appSettings.viewRootPath + 'periodSubcategoryView.html',
                    controller: 'periodSubcategoryCtrl'
                })

                .when('//:category/:balanceType/:from/:to', {
                    templateUrl: appSettings.viewRootPath + 'periodSubcategoryView.html',
                    controller: 'periodSubcategoryCtrl'
                })
                .when('//:category/:balanceType/:from/:to', {
                    templateUrl: appSettings.viewRootPath + 'periodSubcategoryView.html',
                    controller: 'periodSubcategoryCtrl'
                })

                .when('/transactions/:balanceType/:from/:to/:category/:subCategory', {
                    templateUrl: appSettings.viewRootPath + 'transactionList.html',
                    controller: 'transactionsCtrl'
                })
                .when('/transactions/:balanceType/:from/:to/uncategorized', {
                    templateUrl: appSettings.viewRootPath + 'transactionList.html',
                    controller: 'transactionsCtrl'
                })
                .when('/categorizeRules', {
                    templateUrl: appSettings.viewRootPath + 'categorizeRuleList.html',
                    controller: 'categorizeRulesCtrl'
                })
                .when('/categorizeRules/edit', {
                    templateUrl: appSettings.viewRootPath + 'categorizeRuleEdit.html',
                    controller: 'categorizeRuleCtrl'
                })
                .when('/categorizeRules/edit/:id', {
                    templateUrl: appSettings.viewRootPath + 'categorizeRuleEdit.html',
                    controller: 'categorizeRuleCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }]);
    export var appSettings = {
        viewRootPath: "./content/app/views/"
    };
}