var backgroundModule = (function (document, window) {

    var circles = [];
    var width = window.innerWidth;
    var height = window.innerHeight;

    function Canvas(id) {
        this.object = document.getElementById(id);
        this.ctx = this.object.getContext('2d');

        this.object.width = width;
        this.object.height = height;
    }

    function Circle(x, y, radius, color, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;

        this.left = function () {
            return this.x - this.radius;
        }
        this.right = function () {
            return this.x + this.radius;
        }
        this.top = function () {
            return this.y - this.radius;
        }
        this.bottom = function () {
            return this.y + this.radius;
        }
    }

    Circle.prototype.draw = function (context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    Circle.prototype.update = function () {
        this.x += this.dx;
        this.y += this.dy;

        if (this.left() < 0 || this.right() > width) {
            this.dx = -this.dx;
        }

        if (this.top() < 0 || this.bottom() > height) {
            this.dy = -this.dy;
        }
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
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
            var FPS = 60;
            var time = 10;
            
            for (var i = 0; i < 100; i++) {
                circles.push(new Circle(canvas.object.width / 2,
                                        canvas.object.height / 2,
                                        Math.random() * 10,
                                        getRandomColor(),
                                        Math.random()*5,
                                        Math.random()*5));
            }

            
            bigDrawing(canvas);
            
            setInterval(function () {                            
                            for (var i = 0; i < circles.length; i++) {
                                circles[i].update();
                                bigDrawing(canvas);
                            }

                            bigDrawing(canvas);
                        }, 
                        1 / FPS);
        }
    }
}(document, window));