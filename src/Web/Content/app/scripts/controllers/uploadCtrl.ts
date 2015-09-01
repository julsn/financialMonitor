module Cat {
    export class UploadController {
        private _$scope;

        public static $inject = [
            '$scope'
        ];
        constructor(
            private $scope: ng.IScope) {

            this._$scope = $scope;

            this.init();
        }

        private init() {
            this._$scope.uploadFile = () => this.uploadFile();
        }

        private uploadFile() {
            console.log("upload file");

            var el = $("uploadInpt");
            el.click();
            //angular.element().click();
        }
    }
}
