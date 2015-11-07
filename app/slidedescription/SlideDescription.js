(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('slideDescription', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: '/app/slideDescription/slideDescription.tpl.html?version=' + new Date().getTime(),
            scope: {
                photo: '=',
                animationDuration: '=',
                animationDelay: '='
            },
            replace: true, 
            link: function link(scope, element, attrs) {
                if (scope.photo.name) {
                    console.log("Photo has a description", scope.photo.name);
                }
                scope.description = scope.photo.name;
            }
        };
    }]);
})();