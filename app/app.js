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
        '$scope', '$mdSidenav', 'ezfb', '$window', '$location', '$mdDialog', '$q', function ($scope, $mdSidenav, ezfb, $window, $location, $mdDialog, $q) {

            function updateLoginStatus(more) {
                ezfb.getLoginStatus(function (res) {
                    $scope.loginStatus = res;
                    if (res && res.status === 'connected') {
                        $scope.listEvents();
                    }
                    (more || angular.noop)();
                });
            }

            function init() {
                $scope.myEventsOnly = true;
                $scope.showEventsCompleted = false;
                updateLoginStatus(updateApiMe);
            }

            function updateApiMe() {
                ezfb.api('/me', function (res) {
                    $scope.apiMe = res;
                });
            }


            $scope.toggleSidenav = function (menuId) {
                $mdSidenav(menuId).toggle();
            };

            $scope.login = function () {
                /**
                 * Calling FB.login with required permissions specified
                 * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
                 */
                ezfb.login(function (res) {
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
                      link: 'http://fbeventslideshow.azurewebsites.net/',
                      description: ' Show comments and images from your big event on the big screen!' +
                                   ' Try it out and share it with your friends.'
                  },
                  function (res) {
                      // res: FB.ui response
                  }
                );
            };

            $scope.listEvents = function () {
                var filterMine = $scope.myEventsOnly ? "/created" : "";
                var sinceDate = $scope.showEventsCompleted ? "" : "&since=yesterday";
                var eventsGraph = '/me/events' + filterMine + '?fields=cover,description,id,name,start_time' + sinceDate;
                ezfb.api(eventsGraph, function (res) {
                    if (res && res.data) {
                        $scope.myEvents = res.data;
                    }
                });
            };

            $scope.selectEvent = function (selectedEvent, browserEvent) {
                $scope.selectedEvent = selectedEvent;
            }

            $scope.getEventPhotos = function (eventId) {
                return ezfb.api("/" + eventId + "/photos?fields=from,created_time,id,name,images,link");
            }

            $scope.goToPhoto = function (photo, windowEvent) {
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title('Show photo')
                    .content(photo.link)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent(windowEvent)
                );
            }

            $scope.showEventInfo = function (eventId) {
                $scope.getEventPhotos(eventId).then(function (res) {
                    if (res && res.data) {
                        $scope.eventInfo = {
                            photos: res.data
                        };
                    } else {
                        $scope.eventInfo = null;
                    }
                });
            }

            $scope.closeEventInfo = function () {
                $scope.eventInfo = null;
            }

            $scope.$watch("showEventsCompleted", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    console.log("showEventsCompleted changed", newValue, oldValue);
                    $scope.listEvents();
                }
            });

            $scope.$watch("myEventsOnly", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    console.log("myEventsOnly changed", newValue, oldValue);
                    $scope.listEvents();
                }
            });

            init();
        }]);
})();


