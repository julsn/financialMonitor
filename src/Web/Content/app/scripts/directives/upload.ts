module Cat.Directives {

    export class UploadDirective {
        public restrict = "A";
        public scope = {
            data: '='
        };

        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

        private _$http;

        constructor($http: ng.IHttpService) {

            this._$http = $http;

            this.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

                var input = angular.element("<input type='file' style='display:none'/>");
                input.bind('change', () => {
                    var t: any = input[0];

                    if (t.files != null && t.files.length > 0)
                        this.upload(t.files[0]);
                });

                element.parent().append(input);

                element.bind('click', () => {
                    console.log("upload-click");

                    input[0].click();
                });
            }
        }

        public static factory() {
            var directive = ($http: ng.IHttpService) => {
                return new UploadDirective($http);
            };

            directive['$inject'] = ['$http'];

            return directive;
        }

        private upload(file: File) {
            console.log('uploading file: ' + file.name);

            var formData = new FormData();
            formData.append('file', file);
            this._$http.post(
                    "transactions/upload",
                    formData,
                    {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                .success(() => {
                    console.log("file was uploaded successfully");
                })
                .error(() => {
                    console.log("error occured during file upload");
                });
        }
    }
    export function upload() {
        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            link: (scope, element, attrs) => {
                var input = angular.element("<input type='file' style='display:none'/>");
                element.parent().append(input);

                element.bind('click', () => {
                    console.log("upload-click");

                    input[0].click();
                });
            }
        }
    }
}