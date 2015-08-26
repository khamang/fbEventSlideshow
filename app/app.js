(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow', [
        'ngMaterial', 'ezfb'
    ]);

    app.config(function (ezfbProvider) {
        /**
         * Basic setup
         *
         * https://github.com/pc035860/angular-easyfb#configuration
         */
        ezfbProvider.setInitParams({
            appId: '504592706363566',
            version: 'v2.4',
            xfbml: true
        });

        ezfbProvider.setLocale('nb-NO');

    });

    app.controller('AppCtrl', [
        '$scope', '$mdSidenav', 'ezfb', '$window', '$location', function ($scope, $mdSidenav, ezfb, $window, $location) {
            $scope.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };

            /**
            * Update loginStatus result
            */
            function updateLoginStatus(more) {
                ezfb.getLoginStatus(function (res) {
                    $scope.loginStatus = res;

                    (more || angular.noop)();
                });
            }

            /**
             * Update api('/me') result
             */
            function updateApiMe() {
                ezfb.api('/me', function (res) {
                    $scope.apiMe = res;
                });
            }

            updateLoginStatus(updateApiMe);

            $scope.login = function () {
                /**
                 * Calling FB.login with required permissions specified
                 * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
                 */
                ezfb.login(function (res) {
                    /**
                     * no manual $scope.$apply, I got that handled
                     */
                    if (res.authResponse) {
                        updateLoginStatus(updateApiMe);
                    }
                }, { scope: 'email,user_likes' });
            };

            $scope.logout = function () {
                /**
                 * Calling FB.logout
                 * https://developers.facebook.com/docs/reference/javascript/FB.logout
                 */
                ezfb.logout(function () {
                    updateLoginStatus(updateApiMe);
                });
            };

            $scope.share = function () {
                ezfb.ui(
                  {
                      method: 'feed',
                      name: 'angular-easyfb API demo',
                      picture: 'http://plnkr.co/img/plunker.png',
                      link: 'http://plnkr.co/edit/qclqht?p=preview',
                      description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' +
                                   ' Facebook integration in AngularJS made easy!' +
                                   ' Please try it and feel free to give feedbacks.'
                  },
                  function (res) {
                      // res: FB.ui response
                  }
                );
            };

            /**
             * For generating better looking JSON results
             */
            var autoToJSON = ['loginStatus', 'apiMe'];
            angular.forEach(autoToJSON, function (varName) {
                $scope.$watch(varName, function (val) {
                    $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
                }, true);
            });
        }]);
})();


