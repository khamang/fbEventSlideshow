(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow', [
        'ngMaterial', 'ezfb', 'ngAnimate', 'ui.router'
    ]);

    app.config(['ezfbProvider', '$mdThemingProvider', function (ezfbProvider, $mdThemingProvider) {
        ezfbProvider.setInitParams({
            appId: '504592706363566',
            version: 'v2.5',
            xfbml: true
        });

        ezfbProvider.setLocale('nb-NO');

        $mdThemingProvider.definePalette('c-white', {
            '50': 'dddddd',
            '100': 'cccccc',
            '200': 'bbbbbb',
            '300': '999999',
            '400': '777777',
            '500': '666666',
            '600': '555555',
            '700': '444444',
            '800': '333333',
            '900': '222222',
            'A100': 'ffffff',
            'A200': 'dddddd',
            'A400': 'aaaaaa',
            'A700': '777777',
            'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
            // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
             '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
        $mdThemingProvider.theme('c-grey').primaryPalette('c-white');

    }]);

    app.config(function ($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/");
        //states
        $stateProvider
            .state('index', {
                url: "/",
                templateUrl: "app/index.tpl.html",
                controller: "MainController"
            })
            .state('slideshow', {
                url: "/slideshow/:eventId",
                templateUrl: "app/slideshow/slideshow.tpl.html",
                controller: "SlideshowController"
            });
    });
})();


