(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow', [
        'ngMaterial', 'ezfb', 'ngAnimate', 'ui.router'
    ]);

    app.config(function (ezfbProvider) {
        ezfbProvider.setInitParams({
            appId: '504592706363566',
            version: 'v2.5',
            xfbml: true
        });

        ezfbProvider.setLocale('nb-NO');

    });

    app.config(function ($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
            .state('index', {
                url: "/",
                templateUrl: "app/index.tpl.html",
                controller: "MainController"
            })
            .state('slideshow', {
                url: "/slideshow/:eventId",
                templateUrl: "app/slideshow/index.tpl.html",
                controller: "SlideshowController"
            });

    });


})();


