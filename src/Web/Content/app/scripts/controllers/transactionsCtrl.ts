module Cat {
    export class TransactionsController {
        private _$http;
        private _$location;
        private _$scope;

        public static $inject = [
            '$scope',
            '$http',
            '$location',
            '$routeParams'
        ];
        constructor(
            private $scope: ng.IScope,
            private $http: ng.IHttpService,
            private $location: ng.ILocationService,
            private $routeParams: any) {

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

        private init() {
            this._$scope.categoryRes = null;

            this._$scope.setCategory = t => this.setCategory(t);
        }

        private load() {
            this._$http.get('categories')
                .success(data => {
                    this._$scope.categories = data;
                });

            if (this._$scope.category == null) {
                this._$http.get('transactions/uncategorized/'
                        + this._$scope.balanceType + '/'
                        + this._$scope.from + '/'
                        + this._$scope.to)
                    .success(data => {
                        this._$scope.transactions = data;
                    });
            } else {
                this._$http.get('transactions/'
                        + this._$scope.balanceType + '/'
                        + this._$scope.from + '/'
                        + this._$scope.to + '/'
                        + this._$scope.subCategory)
                    .success(data => {
                        this._$scope.transactions = data;
                    });
            }
        }

        private setCategory(t) {
            console.log("change category for transaction = " + t.id + " to " + t.subCategory.name);

            this._$http.post('transactions/'
                + t.id + '/updateCategory',
                t.subCategory.id)
                .success(data => {
                    console.log("category for transaction = " + t.id + " was updated successfully");
                })
                .error(data => {
                    console.log("error occured while updating category for transaction = " + t.id);
            });
        }
    }
}

