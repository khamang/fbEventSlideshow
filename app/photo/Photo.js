(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('photo', ['fbService', function (fbService) {
        return {
            restrict: 'E',
            templateUrl: '/app/photo/photo.tpl.html',
            scope: {
                photo: '=',
                comments: '=',
                animationTime: '='
            },
            transclude: true,
            replace: true, 
            link: function link(scope, element, attrs) {
                scope.image = scope.photo.images[0].source;
                scope.animationStyle = 'animation-duration: ' + scope.animationTime + 's;';
                scope.metaDataFromName = scope.photo.from.name;
                scope.comments.then(function (res) {
                    if (res && res.data && res.data.length > 0) {
                        console.log("Photo has comments!", res.data);
                    }
                });
            }
        };
    }]);
})();