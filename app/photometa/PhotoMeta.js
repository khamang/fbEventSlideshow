(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('photoMeta', ['fbService', function (fbService) {
        return {
            restrict: 'E',
            templateUrl: '/app/photoMeta/photoMeta.tpl.html',
            scope: {
                photo: '=',
                animationTime: '=',
                totalDuration: '='
            },
            transclude: true,
            replace: true, 
            link: function link(scope, element, attrs) {
                scope.metaDataFromName = scope.photo.from.name;
                scope.metaDataTime = scope.photo.created_time;
                scope.animationStyle = 'animation-duration: ' + scope.animationTime + 's;';
            }
        };
    }]);
})();