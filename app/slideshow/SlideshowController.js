(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');

    app.controller('SlideshowController', [
                '$scope', 'ezfb', '$state', 'fbService', '$stateParams', '$rootScope', '$animate', '$timeout', 
        function ($scope, ezfb, $state, fbService, $stateParams, $rootScope, $animate, $timeout) {
            $scope.pristine = true;
            var delay = 4000;
            var currentImageNumber = 0;
            $scope.transition = "transition:" + 20000 / 1000 + "s ease-in-out all";
  
            var previousPhotos = [];

            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

            function loadNewPhotos() {
                console.log("Loading new photos");
                $scope.showLoader = true;
                fbService.getEventPhotos($stateParams.eventId).then(function (res) {
                    $scope.showLoader = false;
                    var photos = null;
                    if (res && res.data) {
                        console.log("New photos loaded. Starting slideshow");
                        $scope.photos = res.data;
                        photos = angular.copy(res.data);
                    } else if (res && res.error) {
                        console.error('Failed to load new photos', res.error);
                        photos = angular.copy($scope.photos); //start again with previous photos
                    }
                    showDelayedPhotos(photos);
                }, function (error) {
                    $scope.showLoader = false;
                    console.error('Async error - Failed to load new photos', error);
                    startSlideShow($scope.photos); //start again with previous photos
                });
            }

            function showDelayedPhotos(photos) {
                $timeout(function () {
                    console.log("ShowPhoto. Delay: ", delay);
                    showPhoto(photos, delay);
                }, delay);
            }

            function showPhoto(photos) {
                var photo = photos.pop();
                var imageNumber = currentImageNumber === 0 ? 1 : 0;
                var imageNumberPrevious = currentImageNumber === 0 ? 0 : 1;
                currentImageNumber = imageNumber;
                console.log("Show photo", photo, imageNumber, imageNumberPrevious);
                $scope['showImage' + imageNumberPrevious] = false;
                $scope['showImage' + imageNumber] = true;
                $scope['image' + imageNumber] = photo.images[0].source;
                if (photos.length > 0) {
                    console.log("There are ore photos in iteration. Length: ", photos.length);
                    showDelayedPhotos(photos);
                } else {
                    //get new photos
                    console.log("This was the last photo. Starting over.");
                    loadNewPhotos();
                }
            }

            function startSlideShow(photoData) {
                console.log("Starting slideshow");
                var photos = angular.copy(photoData);
                showPhoto(photos);
            }

            function init() {
                $scope.showLoader = true;
                ezfb.getLoginStatus(function (res) {
                    if (res && res.status === 'connected') {
                        fbService.getEventPhotos($stateParams.eventId).then(function (res) {
                            console.log("Loaded Event photos", res);
                            $scope.showLoader = false;
                            $scope.pristine = false;
                            if (res && res.data) {
                                $scope.photos = res.data;
                                angular.forEach(res.data, function (photo) {
                                    previousPhotos.push(photo.id);
                                });
                                console.log("Initialized previousPhotos", previousPhotos);
                                startSlideShow(res.data);
                            } else if (res && res.error) {
                                $rootScope.$broadcast("error", res.error);
                            }
                        }, function (error) {
                            $scope.showLoader = false;
                            $scope.pristine = false;
                            $scope.$broadcast("error", error);
                        });
                    } else if (res && res.error) {
                        $rootScope.$broadcast("error", res.error);
                        $scope.exitSlideShow();
                    }
                });
            }

           

           

           
            
            
            //$animate.on('enter', container,
            //    function callback(element, phase) {
            //        // cool we detected an enter animation within the container
            //    }
            //);


            $scope.exitSlideShow = function () {
                exitFullscreen();
                $state.go('index');
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


