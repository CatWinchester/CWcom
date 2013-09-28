define(['helper'],
    function (helper) {
        //========= private variables =========//

        var bezierVertexes = [];

        //========= Constructors ==========//

        function Canvas(id) {
            this.object = document.getElementById(id);
            this.ctx = this.object.getContext('2d');
        }

        function BezierVertex(x, y, width, height, fillColor) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.fillColor = fillColor;

            this.contains = function (pointX, pointY) {
                return pointX > this.x &&
                       pointX < this.x + this.width &&
                       pointY > this.y &&
                       pointY < this.y + this.height;
            }

            this.draw = function (context) {
                context.beginPath();
                context.fillStyle = this.fillColor;
                context.rect(this.x, this.y, this.width, this.height);
                context.closePath();
                context.fill();
            }
        }

        function Point(x, y) {
            this.x = x;
            this.y = y;
        }

        function calculateBezierPoint(vertices, t) {
            var x = 0;
            var y = 0;

            for (var i = 0; i < vertices.length; i++) {
                var bazis = helper.fact(vertices.length - 1) / (helper.fact(i) * helper.fact(vertices.length - 1 - i)) *
                           Math.pow(t, i) * Math.pow(1 - t, vertices.length - 1 - i);

                x += vertices[i].x * bazis;

                y += vertices[i].y * bazis;
            }

            return new Point(x, y);
        }

        function drawSpline(context) {
            context.beginPath();
            context.moveTo(bezierVertexes[0].x, bezierVertexes[0].y);
            for (t = 0; t <= 1; t += 0.01) {
                var point = calculateBezierPoint(bezierVertexes, t);
                context.lineTo(point.x, point.y);
                context.stroke();
            }
            context.closePath();
        }

        function bigDrawing(canvas) {
            canvas.ctx.clearRect(0, 0, canvas.object.width, canvas.object.height);

            for (var i = 0; i < bezierVertexes.length; i++) {
                bezierVertexes[i].draw(canvas.ctx);

                if (i > 0) {
                    canvas.ctx.beginPath();
                    canvas.ctx.moveTo(bezierVertexes[i].x, bezierVertexes[i].y);
                    canvas.ctx.lineTo(bezierVertexes[i - 1].x, bezierVertexes[i - 1].y);
                    canvas.ctx.strokeStyle = helper.getRandomColor();
                    canvas.ctx.stroke();
                    canvas.ctx.closePath();
                }
            }
            drawSpline(canvas.ctx);
        }

        return {
            init: function (canvasId) {
                var canvas = new Canvas(canvasId);

                var dragedVertex = null;

                canvas.object.addEventListener('mousemove', function (e) {
                    if (dragedVertex != null) {
                        dragedVertex.x = e.pageX - this.offsetLeft;
                        dragedVertex.y = e.pageY - this.offsetTop;
                        bigDrawing(canvas);
                    }
                }, false);

                canvas.object.addEventListener('mousedown', function (e) {
                    for (var i = 0; i < bezierVertexes.length; i++) {
                        if (bezierVertexes[i].contains(e.pageX - this.offsetLeft, e.pageY - this.offsetTop)) {
                            dragedVertex = bezierVertexes[i];
                            return;
                        }
                    }
                }, false);

                canvas.object.addEventListener('mouseup', function (e) {
                    dragedVertex = null;
                }, false);

                canvas.object.addEventListener('dblclick', function (e) {
                    bezierVertexes.push(new BezierVertex(e.pageX - this.offsetLeft,
                                                         e.pageY - this.offsetTop,
                                                         10,
                                                         10,
                                                         helper.getRandomColor()));
                    bigDrawing(canvas);
                }, false);

                bigDrawing(canvas);
            }
        }
    }
);