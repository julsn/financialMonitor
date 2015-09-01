/// <reference path="upload.ts" />

module Cat.Directives {
    angular.module('cat.directives', [])
        .directive('catUpload', Cat.Directives.UploadDirective.factory());
} 