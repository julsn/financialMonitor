module Cat {
    export interface IPeriodCategoryScope extends ng.IScope {
        balance: any;

        from: string;
        to: string;

        fromDate: Date;
        toDate: Date;

        balanceType: string;

        showDetails: Function;
        showTransactions: Function;
    }
    export class PeriodCategoryController {
        private _$scope: IPeriodCategoryScope;
        private _$location;
        private _$http;
        

        public static $inject = [
            '$scope',
            '$http',
            '$location',
            '$routeParams'
        ];
        constructor(
            private $scope: IPeriodCategoryScope,
            private $http: ng.IHttpService,
            private $location: ng.ILocationService,
            private $routeParams: any) {

            this._$scope = $scope;
            this._$location = $location;
            this._$http = $http;
            

            this._$scope.from = $routeParams.from;
            this._$scope.to = $routeParams.to;

            this._$scope.fromDate = StringHelper.parseDate($routeParams.from);
            this._$scope.toDate = StringHelper.parseDate($routeParams.to);

            this._$scope.balanceType = $routeParams.balanceType;

            this.init();

            this.load();
        }

        private init() {
            this._$scope.showDetails = d => this.showBalancePerSubCategory(d);
            this._$scope.showTransactions = d => this.showTransactions(d);
        }

        private load() {
            this._$http.get('balance/' + this._$scope.from + '/' + this._$scope.to + '/' + this._$scope.balanceType)
                .success(data => {
                    this._$scope.balance = data;
                });
        }

        private showBalancePerSubCategory(d) {
            console.log("show details for category: " + d.categoryName);

            if (d.categoryName.toLowerCase() == 'uncategorized') {
                this._$location.path("/transactions/"
                    + this._$scope.balanceType + "/"
                    + this._$scope.from + "/"
                    + this._$scope.to + "/uncategorized");
            } else {
                this._$location.path("/balance/"
                    + this._$scope.balanceType + "/"
                    + this._$scope.from + "/"
                    + this._$scope.to + "/"
                    + d.categoryName.toLowerCase());
            }
        }

        showTransactions(d) {
            this._$location.path("/transactions/"
                + this._$scope.balanceType + "/"
                + this._$scope.from + "/"
                + this._$scope.to + "/"
                + d.categoryName.toLowerCase());
        }

    }
}  