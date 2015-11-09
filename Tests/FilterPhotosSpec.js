///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.7/angular.js"/>
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.7/angular-mocks.js"/>
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.7/angular-animate.min.js"/>
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.7/angular-aria.min.js"/>
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.7angular-resource.min.js"/>
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.15/angular-ui-router.min.js"/>
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular-material/0.11.4/angular-material.min.js"/>
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/angular-material-icons/0.6.0/angular-material-icons.min.js"/>
///<reference path="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js"/>
///<reference path="~/app/lib/angular-easyfb.min.js"/>
///<reference path="~/app/fbEventSlideshow.module.js"/>
///<reference path="~/app/services/filterPhotosSvc.js" />

describe('fbEventSlideshow', function () {
    beforeEach(module('fbEventSlideshow'));

    var filterPhotosSvc;

    beforeEach(inject(function (_filterPhotosSvc_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        filterPhotosSvc = _filterPhotosSvc_;
    }));

    describe('filterPhotosSvc', function () {
        it('should return 3 new photos when matched with previous photos', function () {
            var previousPhotos = ['1', '2', '3'];
            var length = filterPhotosSvc.getNewPhotos(previousPhotos);
            expect(length).toEqual(3);
        });

        it('should return 1 new photo when matched with previous photos', function () {
            var previousPhotos = ['1', '2', '3'];
            var length = filterPhotosSvc.getNewPhotos(previousPhotos);
            expect(length).toEqual(1);
        });
    });
});