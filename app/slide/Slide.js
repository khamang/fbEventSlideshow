(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('slide', ['fbService', function (fbService) {
        return {
            restrict: 'E',
            templateUrl: '/app/slide/slide.tpl.html',
            scope: {
                photo: '=',
                animationDuration: '='
            },
            transclude: true,
            replace: true, 
            link: function link(scope, element, attrs) {
                scope.image = scope.photo.images[0].source;
                scope.animationStyle = 'animation-duration: ' + scope.animationDuration + 's;';
                scope.metaDataFromName = scope.photo.from.name;
            }
        };
    }]);
})();