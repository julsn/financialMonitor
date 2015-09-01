module Cat {
    export interface IPeriodSubcategoryScope extends ng.IScope {
        balance: any;

        from: string;
        to: string;

        fromDate: Date;
        toDate: Date;

        balanceType: string;
        category: string;

        showDetails: Function;
    }
    export class PeriodSubcategoryController {
        private _$scope: IPeriodSubcategoryScope;
        private _$location;
        private _$http;

        public static $inject = [
            '$scope',
            '$http',
            '$location',
            '$routeParams'
        ];
        constructor(
            private $scope: IPeriodSubcategoryScope,
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
            this._$scope.category = $routeParams.category;

            this.init();

            this.load();
        }

        private init() {
            this._$scope.showDetails = d => this.showCategoryGroupDetails(d);
        }

        private load() {
            this._$http.get('balance/'
                    + this._$scope.from + '/'
                    + this._$scope.to + '/'
                    + this._$scope.balanceType + '/'
                    + this._$scope.category)
                .success(data => {
                    this._$scope.balance = data;
                });
        }

        private showCategoryGroupDetails(d) {
            console.log("show details for category: " + d.subCategoryName);

            this._$location.path("/transactions/"
                + this._$scope.balanceType + "/"
                + this._$scope.from + "/"
                + this._$scope.to + "/"
                + this._$scope.category + '/'
                + d.subCategoryName.toLowerCase());
        }
    }
}  