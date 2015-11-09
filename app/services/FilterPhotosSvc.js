(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.factory('filterPhotosSvc', [function () {
        function getNewPhotos(previousPhotos) {
            return previousPhotos.length;
        }
        return {
            getNewPhotos: getNewPhotos
        };
    }]);
})();
