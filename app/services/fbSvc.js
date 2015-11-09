(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');

    app.factory('fbService', ['ezfb', '$q', function (ezfb, $q) {
        var getEvents = function (myEventsOnly, showEventsCompleted) {
            var filterMine = myEventsOnly ? "/created" : "";
            var sinceDate = showEventsCompleted ? "" : "&since=yesterday";
            var eventsGraph = '/me/events' + filterMine + '?fields=cover,description,id,name,start_time' + sinceDate;
            return ezfb.api(eventsGraph);
        };

        var getEventPhotos = function (eventId) {
            return ezfb.api("/" + eventId + "/photos?fields=from{picture, name, first_name},created_time,id,name,images,link,likes.summary(true){summary}");
        }

        var getComments = function(photoId) {
            return ezfb.api("/" + photoId + "/comments?order=reverse_chronological&limit=10&fields=from{picture, name, first_name},created_time,id,message");
        }




        return {
            getEvents: getEvents,
            getEventPhotos: getEventPhotos,
            getComments: getComments
        };
    }
    ]);
})();
