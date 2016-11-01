/**
 * Created by Jay on 16/10/31.
 */

/**
 * 定义高速动画函数
 */
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60)
        }
})();

/**
 * 定义球对象
 * @param x
 * @param y
 * @param r
 * @param d
 * @param v
 * @param minX
 * @param maxX
 * @param minY
 * @param maxY
 * @constructor
 */
function BallObj(x, y, r, d, v, minX, maxX, minY, maxY) {
    this.x = x || 0;
    this.y = y || 0;
    this.r = r || 5;
    this.vx = d ? v * Math.sin(d / 180 * Math.PI) : 10;
    this.vy = d ? v * Math.cos(d / 180 * Math.PI) : 0;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.timeStamp = Date.now();

    if (typeof this.getPosition != "function") {
        BallObj.prototype.getPosition = function () {
            var curTime = Date.now(),
                newX = this.x + this.vx * (curTime - this.timeStamp) / 1000,
                newY = this.y + this.vy * (curTime - this.timeStamp) / 1000;

            while (true) {
                if (newX - this.r < this.minX) {

                    newX = 2 * this.minX + 2 * this.r - newX;
                    this.vx = -this.vx;

                } else if (newX + this.r > this.maxX) {

                    newX = 2 * this.maxX - 2 * this.r - newX;
                    this.vx = -this.vx;

                } else if (newY - this.r < this.minY) {

                    newY = 2 * this.minY + 2 * this.r - newY;
                    this.vy = -this.vy;

                } else if (newY + this.r > this.maxY) {

                    newY = 2 * this.maxY - 2 * this.r - newY;
                    this.vy = -this.vy;

                } else {
                    break;
                }
            }

            this.x = newX;
            this.y = newY;
            this.timeStamp = curTime;

            return {
                x: newX,
                y: newY,
                r: this.r
            }
        }
    }
}


window.onload = function () {

    var canvasEl = document.querySelector("#canvas"),
        screenWidth = window.screen.availWidth * 0.6,
        screenHeight = window.screen.availHeight * 0.6;

    canvasEl.width = screenWidth;
    canvasEl.style.width = screenWidth + "px";
    canvasEl.height = screenHeight;
    canvasEl.style.height = screenHeight + "px";
    canvasEl.style.border = "1px solid #666";

    var context = canvasEl.getContext("2d");


    var balls = [];
    for (var i = 0; i < 6; i++) {
        balls.push(new BallObj(50, 50, 10, 45 + i * 7, 400 + 100 * i, 0, screenWidth, 0, screenHeight));
    }


    function main() {

        context.fillStyle = "rgba(255,255,255,1)";
        context.fillRect(0, 0, screenWidth, screenHeight);

        balls.map(function (item, index, array) {

            var position = item.getPosition();

            context.fillStyle = "red";
            context.beginPath();
            context.arc(position.x, position.y, position.r, 0, 2 * Math.PI);
            context.fill();
        });

        requestAnimationFrame(arguments.callee);
    }

    main();
};

