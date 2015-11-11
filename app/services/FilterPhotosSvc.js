(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.factory('filterPhotosSvc', [function () {
        function getNewPhotos(previousPhotos, photos) {
            var newPhotosToShow = [];
            angular.forEach(photos, function (photo) {
                var alreadyShownPhoto = _.find(previousPhotos, { 'id': photo.id });
                if (!alreadyShownPhoto) {
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
