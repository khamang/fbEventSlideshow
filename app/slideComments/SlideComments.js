(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('slideComments', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: '/app/slideComments/slideComments.tpl.html',
            scope: {
                comments: '=',
                animationDuration: '=',
                animationDelay: '=',
                commentAnimationDelay: '='
            },
            replace: true, 
            link: function link(scope, element, attrs) {
                var delayTimer;
                var commentTimer;
                var addComment = function (comments) {
                    var comment = comments.pop();
                    console.log("Adding comment...", comment, "delay:", scope.commentAnimationDelay);
                    $timeout(function () {
                        console.log("...there ", comment.message);
                        element.append("<div ng-if=\"1\" class=\"comment animation_popin-left\" style=\"animation-duration: " + scope.animationDuration + "ms;\">" +
                                        "<span class=\"message\">" +
                                            comment.message +
                                        "<span>" +
                                    "</div>");
                        if (comments.length > 0) {
                            addComment(comments);
                        }
                    }, scope.commentAnimationDelay);
                }

                scope.comments.then(function (res) {
                    if (res && res.data && res.data.length > 0) {
                        console.log("Photo has comments!", res.data);
                        delayTimer = $timeout(function () {
                            console.log("Delaying comments for : ", scope.animationDelay, "seconds");
                            addComment(res.data);
                        }, scope.animationDelay*1000);
                    }
                });

                scope.$on("$destroy",function (event) {
                            if (delayTimer){$timeout.cancel(delayTimer);}
                            if (commentTimer){$timeout.cancel(commentTimer);}
                        }
                    );
            }
        };
    }]);
})();