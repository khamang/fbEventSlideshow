(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.factory('filterPhotosSvc', [function () {
        function getNewPhotos(previousPhotos, photos) {
            var newPhotosToShow = [];
            angular.forEach(photos, function (photo) {
                var alreadyShownPhoto = _.indexOf(previousPhotos, photo.id);
                if (alreadyShownPhoto < 0) {
                    newPhotosToShow.push(photo);
                }
            });

            return newPhotosToShow;
        }
        return {
            getNewPhotos: getNewPhotos
        };
    }]);
})();
