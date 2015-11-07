(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('slide', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: '/app/slide/slide.tpl.html?version=' + new Date().getTime(),
            scope: {
                photo: '=',
                animationDuration: '='
            },
            replace: true, 
            link: function link(scope, element, attrs) {
                scope.image = scope.photo.images[0].source;
                scope.metaDataFromName = scope.photo.from.name;
            }
        };
    }]);
})();