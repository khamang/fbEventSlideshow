(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');

    app.controller('SlideshowController', [
                '$scope', 'ezfb', '$state', 'fbService', '$stateParams', '$rootScope', '$animate', '$timeout', 
        function ($scope, ezfb, $state, fbService, $stateParams, $rootScope, $animate, $timeout) {
            $scope.pristine = true;
            var slideTime = 6; //seconds
            var slideAnimationDuration = 6; //seconds
            var metaAnimationDuration = slideAnimationDuration > 5 ? slideAnimationDuration / 2 : 2;
            var metaAnimationDelay = metaAnimationDuration / 2;
            var descriptionAnimationDuration = metaAnimationDuration;
            var descriptionAnimationDelay = metaAnimationDelay / 3;
            var commentsAnimationDuration = 800; //milliseconds
            var commentsAnimationDelay = metaAnimationDelay + metaAnimationDuration;
            var commentAnimationDelay = 500; //milliseconds

            var totalSlideDuration = (slideTime + slideAnimationDuration) * 1000;
            var currentSlideNumber = 0;

            $scope.slideAnimationDuration = slideAnimationDuration;
            $scope.metaAnimationDuration = metaAnimationDuration;
            $scope.metaAnimationDelay = metaAnimationDelay;
            $scope.descriptionAnimationDuration = descriptionAnimationDuration;
            $scope.descriptionAnimationDelay = descriptionAnimationDelay;
            $scope.commentsAnimationDuration = commentsAnimationDuration;
            $scope.commentsAnimationDelay = commentsAnimationDelay;
            $scope.commentAnimationDelay = commentAnimationDelay;
              
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

            function showSlide(photos) {
                var photo = photos.pop();
                var slideNumber = currentSlideNumber === 0 ? 1 : 0;
                var slideNumberPrevious = currentSlideNumber === 0 ? 0 : 1;
                currentSlideNumber = slideNumber;
                console.log("Show slide", photo, slideNumber, slideNumberPrevious);
                $scope['showSlide' + slideNumberPrevious] = false;

                $scope['photo' + slideNumber] = photo;
                $scope['photoComments' + slideNumber] = fbService.getComments(photo.id);
                $scope['showSlide' + slideNumber] = true;
                $scope.debugInfo = photo;
                $scope.debug = false;
                if (photos.length > 0) {
                    console.log("There are photos in iteration. Length: ", photos.length);
                    showSlideDelayed(photos);
                } else {
                    //get new photos
                    console.log("This was the last slide. Starting over.");
                    loadNewPhotos();
                }
            }

            function showSlideDelayed(photos) {
                $timeout(function () {
                    console.log("ShowPhoto. totalSlideDuration: ", totalSlideDuration);
                    showSlide(photos);
                }, totalSlideDuration);
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
                    showSlideDelayed(photos);
                }, function (error) {
                    $scope.showLoader = false;
                    console.error('Async error - Failed to load new photos', error);
                    startSlideShow($scope.photos); //start again with previous photos
                });
            }

            function startSlideShow(photoData) {
                console.log("Starting slideshow");
                var photos = angular.copy(photoData);
                showSlide(photos);
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
                                //previousPhotos.pop(); //debug;
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


