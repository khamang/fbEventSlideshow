(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');

    app.controller('SlideshowController', [
                '$scope', 'ezfb', '$state', 'fbService', '$stateParams', '$rootScope', '$animate', '$timeout', '$document',
        function ($scope, ezfb, $state, fbService, $stateParams, $rootScope, $animate, $timeout, $document) {
            $scope.pristine = true;

            var slideTime = 12; //seconds
            var slideAnimationDuration = 3; //seconds
            var metaAnimationDuration = slideAnimationDuration > 5 ? slideAnimationDuration / 2 : 2;
            var metaAnimationDelay = metaAnimationDuration / 2;
            var descriptionAnimationDuration = metaAnimationDuration;
            var descriptionAnimationDelay = metaAnimationDelay / 3;
            var commentsAnimationDuration = 600; //milliseconds
            var commentsAnimationDelay = metaAnimationDelay + metaAnimationDuration;
            var commentAnimationDelay = 400; //milliseconds
            var numberOfLikesAnimationDuration = metaAnimationDuration;
            var numberOfLikesAnimationDelay = metaAnimationDelay * 1000 + 300; //milliseconds
            var mostLikedAnimationDuration = metaAnimationDuration;
            var mostLikedAnimationDelay = numberOfLikesAnimationDelay + 300; //milliseconds


            var maxNumberOfSlides = 3;
            var maxNumberOfTopLikedSlides = 2;
            var skipFilterToShowAllSlides = true;
            var numberOfIterations = 0;
            var numberOfIterationsToResetSkipFilter = 10;

            var totalSlideDuration = (slideTime + slideAnimationDuration) * 1000;
            var currentSlideNumber = 0;
            var showExitButonTimer;

            $scope.slideAnimationDuration = slideAnimationDuration;
            $scope.metaAnimationDuration = metaAnimationDuration;
            $scope.metaAnimationDelay = metaAnimationDelay;
            $scope.descriptionAnimationDuration = descriptionAnimationDuration;
            $scope.descriptionAnimationDelay = descriptionAnimationDelay;
            $scope.commentsAnimationDuration = commentsAnimationDuration;
            $scope.commentsAnimationDelay = commentsAnimationDelay;
            $scope.commentAnimationDelay = commentAnimationDelay;
            $scope.numberOfLikesAnimationDuration = numberOfLikesAnimationDuration;
            $scope.numberOfLikesAnimationDelay = numberOfLikesAnimationDelay;
            $scope.mostLikedAnimationDuration = mostLikedAnimationDuration;
            $scope.mostLikedAnimationDelay = mostLikedAnimationDelay;

            $scope.showExitButton = false;

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
                var photo = photos.shift();
                var slideNumber = currentSlideNumber === 0 ? 1 : 0;
                var slideNumberPrevious = currentSlideNumber === 0 ? 0 : 1;
                currentSlideNumber = slideNumber;
                console.log("Show slide", photo, slideNumber, slideNumberPrevious);
                $scope['showSlide' + slideNumberPrevious] = false;

                $scope['photo' + slideNumber] = photo;
                $scope['photoComments' + slideNumber] = fbService.getComments(photo.id);
                $scope['photoNumberOfLikes' + slideNumber] = photo.likes.summary.total_count;
                $scope['showSlide' + slideNumber] = true;
                
                $scope.debugInfo = photo;
                $scope.debug = false;
                if (photos.length > 0) {
                    console.log("There are photos in iteration. Length: ", photos.length);
                    showSlideDelayed(photos);
                } else {
                    //get new photos
                    console.log("This was the last slide. Starting over.");
                    numberOfIterations++;
                    if (numberOfIterationsToResetSkipFilter > 0 && numberOfIterations >= numberOfIterationsToResetSkipFilter) {
                        console.log("Resetting filter to show all slides. Number of iterations: ", numberOfIterations);
                        numberOfIterations = 0;
                        skipFilterToShowAllSlides = true;
                    }
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
                    showSlideDelayed(filterPhotos(photos));
                }, function (error) {
                    $scope.showLoader = false;
                    console.error('Async error - Failed to load new photos', error);
                    startSlideShow($scope.photos); //start again with previous photos
                });
            }

            function startSlideShow(photoData) {
                console.log("Starting slideshow");
                var photos = filterPhotos(angular.copy(photoData));
                showSlide(photos);
            }

            function filterPhotos(photos) {
                if (!photos || photos.length === 0) {
                    return photos;
                }
                //Find coverPhoto
                var filteredPhotos = angular.copy(photos);
                var coverPhoto = photos[photos.length - 1];

                if (!skipFilterToShowAllSlides) {
                    if (maxNumberOfSlides > 0 && maxNumberOfSlides > filteredPhotos.length) {
                        filteredPhotos = filteredPhotos.slice(0, maxNumberOfSlides);
                    }
                }

                filteredPhotos.reverse(); //reverse to get newest first...

                if (coverPhoto) {
                    var isCoverPhotoInFilteredPhotos = _.some(filteredPhotos, { 'id': coverPhoto.id });
                    if (!isCoverPhotoInFilteredPhotos) {
                        console.log("Adding cover Photo", coverPhoto);
                        filteredPhotos.splice(0, 0, coverPhoto);
                    } else {
                        console.log("Coverphoto is already in filtered photos.");
                    }
                }

                //Find Most Liked Photos
                if (maxNumberOfTopLikedSlides > 0) {
                    var mostLikesPhotos = _.chain(photos).filter(function (item) { return item.likes.summary.total_count > 0; }).sortBy(function (item) { return item.likes.summary.total_count }).reverse().value().slice(0, maxNumberOfTopLikedSlides);
                    console.log("Most liked photos", mostLikesPhotos, mostLikesPhotos.length);
                    var mostLikedCounter = 1;
                    angular.forEach(mostLikesPhotos, function (mostLikedPhoto) {
                        var mostedLikedPhotoInFilteredPhoto = _.find(filteredPhotos, { 'id': mostLikedPhoto.id });
                        if (mostedLikedPhotoInFilteredPhoto) {
                            mostedLikedPhotoInFilteredPhoto.mostLiked = true;
                        } else {
                            mostLikedPhoto.mostLiked = true;
                            filteredPhotos.push(mostLikedPhoto);
                        }
                        mostLikedCounter++;
                    });
                }
                console.log("Filtered photos", filteredPhotos, filteredPhotos.length);

                skipFilterToShowAllSlides = false;
                return filteredPhotos;
            }

            function setShowExitButtonTimer() {
                $timeout.cancel(showExitButonTimer);
                showExitButonTimer = $timeout(function () {
                    console.log("showExitButonTimer. Hiding button", showExitButonTimer);
                    $scope.showExitButton = false;
                }, 3000);
                $scope.showExitButton = true;
            }

            function mousemove() {
                setShowExitButtonTimer();
                $scope.$apply();
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

            $document.on('mousemove', mousemove);



            init();
        }]);
})();


