(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('slideMeta', [function () {
        return {
            restrict: 'E',
            templateUrl: '/app/slideMeta/slideMeta.tpl.html?version=' + new Date().getTime(),
            scope: {
                photo: '=',
                animationDuration: '=',
                animationDelay: '='
            },
            replace: true, 
            link: function link(scope, element, attrs) {
                scope.metaDataFromName = scope.photo.from.first_name;
                scope.metaDataFromImageUrl = scope.photo.from.picture && scope.photo.from.picture.data ? scope.photo.from.picture.data.url : null;
                scope.metaDataTime = scope.photo.created_time;
            }
        };
    }]);
})();