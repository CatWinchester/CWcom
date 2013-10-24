var backgroundModule = (function (document) {

    var circles = [];

    function Canvas(id) {
        this.object = document.getElementById(id);
        this.ctx = this.object.getContext('2d');

        this.object.width = window.innerWidth;
        this.object.height = window.innerHeight;
    }

    function Circle(x, y, radius, color, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
    }

    Circle.prototype.draw = function (context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    Circle.prototype.move = function () {
        this.x += this.dx;
        this.y += this.dy;
    }

    Circle.prototype.increaseRadius = function () {
        this.radius = x;
    }

    function bigDrawing(canvas) {
        canvas.ctx.clearRect(0, 0, canvas.object.width, canvas.object.height);

        for (var i = 0; i < circles.length; i++) {
            circles[i].draw(canvas.ctx);
        }
    }

    return {
        init: function (canvasId) {
            var canvas = new Canvas(canvasId);
            
            for (var i = 0; i < 100; i++) {
                circles.push(new Circle(canvas.object.width / 2,
                                        canvas.object.height / 2,
                                        Math.random() * 10,
                                        '#fff',
                                        5));
            }

            bigDrawing(canvas);
        }
    }
}(document));