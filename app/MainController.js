(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    
    app.controller('MainController', [
                 '$scope', '$mdSidenav', 'ezfb', '$window', '$location', '$mdDialog', '$q', '$state','fbService',
        function ($scope, $mdSidenav, ezfb, $window, $location, $mdDialog, $q, $state, fbService) {
            function launchIntoFullscreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }


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
                fbService.getEvents($scope.myEventsOnly, $scope.showEventsCompleted).then(function (result) {
                    $scope.myEvents = result.data;
                }, function () {
                    $scope.myEvents = null;
                });
            };

            $scope.selectEvent = function (selectedEvent, browserEvent) {
                $scope.selectedEvent = selectedEvent;
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
                fbService.getEventPhotos(eventId).then(function (res) {
                    if (res && res.data) {
                        $scope.eventInfo = {
                            photos: res.data
                        };
                    } else {
                        $scope.eventInfo = null;
                    }
                });
            }

            $scope.playSlideshow = function (selectedEventId) {
                $state.go('slideshow', { eventId: selectedEventId, version: new Date().getTime() });
                // Launch fullscreen for browsers that support it!
                launchIntoFullscreen(document.documentElement); // the whole page
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


