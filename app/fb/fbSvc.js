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
            return ezfb.api("/" + eventId + "/photos?fields=from,created_time,id,name,images,link");
        }


        return {
            getEvents: getEvents,
            getEventPhotos: getEventPhotos
        };
    }
    ]);
})();
