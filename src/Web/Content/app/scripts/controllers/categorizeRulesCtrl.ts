module Cat {
    export interface ICategorizeRulesScope extends ng.IScope {
        rules: any;

        addRule: Function;
        edit: Function;
        remove: Function;
    }

    export class CategorizeRulesController {
        _$scope: ICategorizeRulesScope;
        _$http: ng.IHttpService;
        _$location: ng.ILocationService;

        static $inject = [
            '$scope',
            '$http',
            '$location'

        ];
        constructor(
            $scope: ICategorizeRulesScope,
            $http: ng.IHttpService,
            $location: ng.ILocationService) {

            this._$scope = $scope;
            this._$http = $http;
            this._$location = $location;

            this.init();
            this.load();
        }

        init() {
            this._$scope.addRule = () => this.addRule();
            this._$scope.edit = (r) => this.edit(r);
            this._$scope.remove = (r) => this.remove(r);
        }

        load() {
            this._$http.get('categories/categorizeRules')
                .success(data => {
                    this._$scope.rules = data;
                });
        }

        edit(rule) {
            this._$location.path("categorizeRules/edit/" + rule.id);
        }

        remove(rule) {
            this._$http.delete('categories/categorizeRules/' + rule.id)
                .success(data => {
                    this._$http.get('categories/categorizeRules')
                        .success(data => {
                            this._$scope.rules = data;
                        });
                });
        }

        addRule() {
            this._$location.path("categorizeRules/edit/");
        }
    }
}  