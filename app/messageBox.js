(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('messageBox', ['$rootScope', function($rootScope) {
        return {
            restrict: 'E',
            template: '<div class"error" ng-if="message"><span class="message">{{message}}</span></div>',
            link: function link(scope, element, attrs) {
                $rootScope.$on("error", function (event, error) {
                    scope.message = error.message;
                });
            }
        };
    }]);
})();
