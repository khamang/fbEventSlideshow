(function () {
    'use strict';
    var app = angular.module('fbEventSlideshow');
    app.directive('slideComments', ['$timeout', '$animate', function ($timeout, $animate) {
        return {
            restrict: 'E',
            templateUrl: '/app/slideComments/slideComments.tpl.html?version=' + new Date().getTime(),
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
                var parent = element;
                var addComment = function (comments) {
                    var comment = comments.pop();
                    console.log("Adding comment...", comment, "delay:", scope.commentAnimationDelay);
                    $timeout(function () {
                        var imageUrl = comment.from.picture && comment.from.picture.data ? comment.from.picture.data.url : "";
                        console.log("...there ", comment.message, "parent", parent);
                        var newComment = angular.element("<div class=\"comment animation_popin-left\" style=\"animation-duration: " + scope.animationDuration + "ms;\">" +
                                        "<img src=\"" + imageUrl + "\"><span class=\"message\">" +
                                            comment.message +
                                        "<span>" +
                                    "</div>");
                        $animate.enter(newComment, parent);
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