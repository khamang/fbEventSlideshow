(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('slideNumberOfLikes', [function () {
        return {
            restrict: 'E',
            templateUrl: '/app/slideLikes/slideNumberOfLikes.tpl.html?version=' + new Date().getTime(),
            scope: {
                numberOfLikes: '=',
                animationDuration: '=',
                animationDelay: '='
            },
            replace: true
        };
    }]);
})();