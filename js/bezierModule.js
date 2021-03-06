﻿define(['./helper'],
    function (helper) {        
        //========= Constructors ==========//	
        function Canvas(id) {
            this.object = document.getElementById(id);
            this.ctx = this.object.getContext('2d');
        }

        function Point(x, y) {
            this.x = x;
            this.y = y;
        }

        function BezierVertex(x, y, fillColor) {
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 10;
            this.fillColor = fillColor;
            this.origin = new Point(0, 0);

            this.contains = function (pointX, pointY) {
                return pointX >= this.x + this.origin.x &&
                       pointX <= this.x + this.origin.x + this.width &&
                       pointY >= this.y + this.origin.y &&
                       pointY <= this.y + this.origin.y + this.height;
            }

            this.draw = function (context) {
                context.beginPath();
                context.fillStyle = this.fillColor;
                context.rect(this.x + this.origin.x,
                             this.y + this.origin.y,
                             this.width,
                             this.height);
                context.closePath();
                context.fill();
            }
        }

        BezierVertex.prototype.move = function (offsetX, offsetY) {
            this.x += offsetX;
            this.y += offsetY;
        };

        function BezierSpline(vertices) {
            if (vertices.length < 3) {
                throw new RangeError();
            }
            this.vertices = vertices;
            this.origin = new Point(0, 0);

            for (var i = 0; i < this.vertices.length; i++) {
                this.vertices[i].origin = this.origin;
            }
        }

        BezierSpline.prototype.addVertex = function (vertex) {
            vertex.origin = this.origin;

            this.vertices.push(vertex);
        }

        BezierSpline.prototype.removeVertex = function (vertex) {
            if (this.vertices.length < 4) {
                throw new RangeError();
            }
            var index = this.vertices.indexOf(vertex);

            if (index > -1) {
                this.vertices.splice(index, 1);
            }
        }

        BezierSpline.prototype.calculateBezierPoint = function (t) {
            var x = 0;
            var y = 0;

            for (var i = 0; i < this.vertices.length; i++) {
                var bazis = helper.fact(this.vertices.length - 1) / (helper.fact(i) * helper.fact(this.vertices.length - 1 - i)) *
                           Math.pow(t, i) * Math.pow(1 - t, this.vertices.length - 1 - i);

                x += this.vertices[i].x * bazis;

                y += this.vertices[i].y * bazis;
            }

            return new Point(x, y);
        }

        BezierSpline.prototype.move = function (offsetX, offsetY) {
            this.origin.x += offsetX;
            this.origin.y += offsetY;
        }

        BezierSpline.prototype.findVertex = function (x, y) {
            for (var i = 0; i < this.vertices.length; i++) {
                if (this.vertices[i].contains(x, y)) {
                    return this.vertices[i];
                }
            }
            return null;
        }

        BezierSpline.prototype.contains = function (pointX, pointY) {
            for (var i = 0; i < this.vertices.length; i++) {
                if (this.vertices[i].contains(pointX, pointY))
                    return true;
            }
            return false;
        }

        BezierSpline.prototype.draw = function (context) {
            context.beginPath();
            context.moveTo(this.vertices[0].x + this.origin.x, this.vertices[0].y + this.origin.y);
            for (t = 0; t <= 1; t += 0.01) {
                var point = this.calculateBezierPoint(t);
                context.lineTo(point.x + this.origin.x, point.y + this.origin.y);
                context.strokeStyle = helper.getRandomColor();
                context.lineWidth = 3;
                context.stroke();
            }
            context.closePath();

            for (var i = 0; i < this.vertices.length; i++) {
                this.vertices[i].draw(context);

                //draw lines between bezier vertices
                if (i > 0) {
                    context.beginPath();
                    context.moveTo(this.vertices[i].x + this.origin.x, this.vertices[i].y + this.origin.y);
                    context.lineTo(this.vertices[i - 1].x + this.origin.x, this.vertices[i - 1].y + this.origin.y);
                    context.strokeStyle = '#ff0000';
                    context.lineWidth = 1;
                    context.stroke();
                    context.closePath();
                }
            }
        }

        //========= Functions ==========//

        function bigDrawing(canvas, splines) {
            canvas.ctx.clearRect(0, 0, canvas.object.width, canvas.object.height);

            for (var i = 0; i < splines.length; i++) {
                splines[i].draw(canvas.ctx);
            }
        }

        return {
            init: function (canvasId, addSplineDivId) {
                var canvas = new Canvas(canvasId);
                var splines = [];

                var dragedVertex = null;
                var dragedSpline = null;
                var chosenSpline = null;
                var isCtrlPressed = false;

                var prevMouseX = 0;
                var prevMouseY = 0;

                document.getElementById(addSplineDivId).addEventListener("click", function () {
                    
                    splines.push(new BezierSpline([new BezierVertex(20, 30, helper.getRandomColor()),
                                                   new BezierVertex(130, 40, helper.getRandomColor()),
                                                   new BezierVertex(40, 120, helper.getRandomColor())]));

                    bigDrawing(canvas, splines);
                
                },false)
                                
                canvas.object.addEventListener('mousemove', function (e) {
                    if (dragedVertex != null) {
                        dragedVertex.move(e.pageX - this.offsetLeft - prevMouseX,
                                          e.pageY - this.offsetTop - prevMouseY);
                        bigDrawing(canvas, splines);
                    }

                    if (dragedSpline != null) {
                        dragedSpline.move(e.pageX - this.offsetLeft - prevMouseX,
                                          e.pageY - this.offsetTop - prevMouseY);

                        bigDrawing(canvas, splines);
                    }

                    prevMouseX = e.pageX - this.offsetLeft;
                    prevMouseY = e.pageY - this.offsetTop;
                }, false);

                canvas.object.addEventListener('mousedown', function (e) {
                    prevMouseX = e.pageX - this.offsetLeft;
                    prevMouseY = e.pageY - this.offsetTop;

                    if (isCtrlPressed) {
                        for (var i = 0; i < splines.length; i++) {
                            if (splines[i].contains(e.pageX - this.offsetLeft, e.pageY - this.offsetTop)) {
                                chosenSpline = splines[i];
                                dragedSpline = splines[i];
                                return;
                            }
                        }
                    } else {
                        for (var i = 0; i < splines.length; i++) {
                            dragedVertex = splines[i].findVertex(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                            if (dragedVertex != null) return;

                        }
                    }
                }, false);

                canvas.object.addEventListener('mouseup', function (e) {
                    dragedVertex = null;
                    dragedSpline = null;
                }, false);

                canvas.object.addEventListener('dblclick', function (e) {
                    if (chosenSpline != null) {
                        chosenSpline.addVertex(new BezierVertex(e.pageX - this.offsetLeft - chosenSpline.origin.x,
                                                                e.pageY - this.offsetTop - chosenSpline.origin.y,
                                                                helper.getRandomColor()));
                        bigDrawing(canvas, splines);
                    }
                }, false);

                canvas.object.addEventListener('keydown', function (e) {

                    //---------" + "----------//
                    if (e.keyCode == 187) {
                        splines.push(new BezierSpline([new BezierVertex(20, 20, helper.getRandomColor()),
                                                       new BezierVertex(200, 150, helper.getRandomColor()),
                                                       new BezierVertex(300, 300, helper.getRandomColor())]));

                        bigDrawing(canvas, splines);
                    }

                    //---------" ctrl "----------//
                    if (e.keyCode == 17) {
                        isCtrlPressed = true;
                    }
                }, false);

                canvas.object.addEventListener('keyup', function (e) {

                    //---------" ctrl "----------//
                    if (e.keyCode == 17) isCtrlPressed = false;
                }, false);

                bigDrawing(canvas, splines);
            }
        }
    }
);