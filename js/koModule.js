define(['jquery', 'knockout', './bezierModule'],
    function ($, ko, bezierModule) {
        function Post(day, header, description, template) {
            this.day = day;
            this.header = header;
            this.description = description;
            this.template = template;
        }

        function ImagePost(day, header, description, image) {
            Post.call(this, day, header, description, 'imagePost');

            this.image = image;
        }

        ImagePost.prototype = Object.create(new Post());

        function CanvasPost(day, header, description, canvasId) {
            Post.call(this, day, header, description, 'canvasPost');

            this.canvasId = canvasId;
        }

        CanvasPost.prototype = Object.create(new Post());

        function BlogViewModel() {
            var self = this;

            var numberOfItemsInRow = 4;

            self.posts = ko.observableArray();

            self.getTemplate = function (post) {
                return post.template;
            }

            self.getRowPosts = function (rowIndex) {
                var foundPosts = [];
                
                for (var i = numberOfItemsInRow * rowIndex;
                         i >= 0 &&
                         i < numberOfItemsInRow * rowIndex + numberOfItemsInRow &&
                         i < self.posts().length;
                         i++) {
                    foundPosts.push(self.posts()[i]);
                }

                return foundPosts;
            }

            self.getNumberOfRows = function () {
                var mod = self.posts().length % numberOfItemsInRow;

                if (mod != 0)
                    return (self.posts().length - mod) / numberOfItemsInRow + 1;
                else return self.posts().length / numberOfItemsInRow;
            };

            self.selectedRow = ko.observable();

            self.rowBeforeSelected = ko.computed(function () {
                return self.selectedRow() == 0 ? self.getNumberOfRows() == 1 ? null
                                                                             : self.getNumberOfRows() - 1
                                               : self.selectedRow() - 1;
            });

            self.rowAfterSelected = ko.computed(function () {
                return self.selectedRow() == self.getNumberOfRows() - 1 ? self.getNumberOfRows() == 1 ? null
                                                                                                      : 0
                                                                        : self.selectedRow() + 1;
            });

            self.mainRowPosts = ko.computed(function () {
                return self.getRowPosts(self.selectedRow());
            });

            self.topRowPosts = ko.computed(function () {
                return self.rowBeforeSelected() == null ? []
                                                        : self.getRowPosts(self.rowBeforeSelected());
            });

            self.bottomRowPosts = ko.computed(function () {
                return self.rowAfterSelected() == null ? []
                                                       : self.getRowPosts(self.rowAfterSelected());
            });

            self.moveUp = function () {
                if (self.rowAfterSelected() != null)
                    self.selectedRow(self.rowAfterSelected());
            };

            self.moveDown = function () {
                if (self.rowBeforeSelected() != null)
                    self.selectedRow(self.rowBeforeSelected());
            };

            self.postRendered = function (posts) {
                for (var i = 0; i < posts.length; i++) {
                    if (posts[i].tagName) {
                        var canvases = posts[i].getElementsByClassName("bezierCanvas");
                        for (var j = 0; j < canvases.length; j++) {
                            bezierModule.init(canvases[j].id, "addCurveButton");
                        }
                    }
                }
            }
        }

        return {
            init: function () {
                var vm = new BlogViewModel();

                vm.posts().push(new ImagePost("Day 1",
                                              "First version",
                                              "This is the first version of my site. It will be updated as often as new version is ready (hope every day:)).",
                                              "content/images/day1.jpg"),
                                new CanvasPost("Day 2",
                                               "Many days after...",
                                               "Bezier training",
                                               "day2Bezier"));

                $('#content').bind('mousewheel',
                           function (e) {
                               if (e.originalEvent.wheelDelta > 0) {
                                   vm.moveDown();
                               }
                               else {
                                   vm.moveUp();
                               };
                           });

                vm.selectedRow(0);

                ko.applyBindings(vm);

            }
        }
    }
);