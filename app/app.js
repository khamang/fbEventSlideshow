(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow', [
        'ngMaterial', 'ezfb'
    ]);

    app.config(function (ezfbProvider) {
        ezfbProvider.setInitParams({
            appId: '504592706363566',
            version: 'v2.5',
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
                    if (res && res.status === 'connected') {
                        $scope.listEvents();
                    }
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
                }, { scope: 'email,user_likes,user_events' });
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
                      name: 'Facebook Event Slideshow',
                      picture: 'http://plnkr.co/img/plunker.png',
                      link: 'http://http://fbeventslideshow.azurewebsites.net/',
                      description: ' Show comments and images from your big event on the big screen!' +
                                   ' Try it out and share it with your friends.'
                  },
                  function (res) {
                      // res: FB.ui response
                  }
                );
            };

            $scope.listEvents = function () {
                ezfb.api('/me/events', function (res) {
                    if (res && res.data) {
                        $scope.myEvents = res.data;
                    }
                });
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


