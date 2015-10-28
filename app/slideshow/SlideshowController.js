(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    
    app.controller('SlideshowController', [
                '$scope', 'ezfb', '$window', '$q', '$stateParams',
        function ($scope, ezfb, $window, $q, $stateParams) {
            

            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

            function init() {
              
            }

            $scope.selectEvent = function (selectedEvent, browserEvent) {
                $scope.selectedEvent = selectedEvent;
            }

            $scope.getEventPhotos = function (eventId) {
                return ezfb.api("/" + eventId + "/photos?fields=from,created_time,id,name,images,link");
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
            
            $scope.$watch("showEventsCompleted", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    console.log("showEventsCompleted changed", newValue, oldValue);
                    $scope.listEvents();
                }
            });

            init();
        }]);
})();


