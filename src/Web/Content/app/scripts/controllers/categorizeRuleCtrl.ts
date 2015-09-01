module Cat {
    export interface ICategorizeRuleScope extends ng.IScope {
        id: number;
        rule: any;

        types: any;
        categories: any;

        save: Function;
        cancel: Function;
    }
    export class CategorizeRuleController {
        _$scope: ICategorizeRuleScope;
        _$location : ng.ILocationService;
        _$http : ng.IHttpService;
        _$routeParams: any;

        static $inject = [
            '$scope',
            '$http',
            '$location',
            '$routeParams'
        ];
        constructor(
            $scope: ICategorizeRuleScope,
            $http: ng.IHttpService,
            $location: ng.ILocationService,
            $routeParams: any) {

            this._$scope = $scope;
            this._$location = $location;
            this._$http = $http;
            this._$routeParams = $routeParams;
            
            this.init();
            this.load();
        }

        init() {

            this._$scope.id = this._$routeParams.id;

            this._$scope.save = () => this.save();
            this._$scope.cancel = () => this.cancel();
        }

        load() {
            if (this._$scope.id != null) {
                this._$http.get("categories/categorizeRules/" + this._$scope.id)
                    .success(data => {
                        this._$scope.rule = data;
                });
            }

            this._$http.get("categories/categorizeRules/transactionTypes")
                .success(data => {
                    this._$scope.types = data;
                });

            this._$http.get("categories")
                .success(data => {
                    this._$scope.categories = data;
                });
        }

        save() {
            if (this._$scope.id != null) {
                this._$http.put("categories/categorizeRules/" + this._$scope.id, this._$scope.rule)
                .success(() => {
                    this._$location.path("categorizeRules/");
                });
            } else {
                this._$http.post("categories/categorizeRules", this._$scope.rule)
                .success(() => {
                    this._$location.path("categorizeRules/");
                });
            }
        }
        
        cancel() {
            this._$location.path("categorizeRules/");
        }
    }
}  