(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('slideDescription', ['fbService', function (fbService) {
        return {
            restrict: 'E',
            templateUrl: '/app/slideDescription/slideDescription.tpl.html',
            scope: {
                photo: '=',
                animationDuration: '=',
                animationDelay: '='
            },
            transclude: true,
            replace: true, 
            link: function link(scope, element, attrs) {
                if (scope.photo.name) {
                    console.log("Photo has a description", scope.photo.name);
                }
                scope.description = scope.photo.name;
                scope.animationStyle = 'animation-duration: ' + scope.animationDuration + 's; animation-delay: ' + scope.animationDelay + 's';
            }
        };
    }]);
})();