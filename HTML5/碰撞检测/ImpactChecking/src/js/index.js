/**
 * Created by 断崖 on 2016/10/31.
 * 运用二维向量解决运动计算
 */

// 定义高速动画接口（向下兼容）
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function BallObj(x, y, r, v, d) {
    // 初始化参数
    this.x = x || 0;
    this.y = y || 0;
    this.r = r || 10;
    this.v = v || 10;
    this.d = d || 90;
}

function isOverLapping(ball1, ball2) {
    return Math.sqrt(
        Math.pow(Math.abs(ball1.x - ball2.x), 2)
        + Math.pow(Math.abs(ball1.y - ball2.y), 2)
        ) < (ball1.r + ball2.r)
}

var canvasEl = document.querySelector("#canvas"),
    screenWidth = window.screen.availWidth * 0.6,
    screenHeight = window.screen.availHeight * 0.6;

canvasEl.width = screenWidth;
canvasEl.style.width = screenWidth;
canvasEl.height = screenHeight;
canvasEl.style.height = screenHeight;

var context = canvasEl.getContext("2d"),
    balls = [];

for (var i = 0; i < 3; i++) {
    balls.push(new BallObj(20 * i, 20 * i, 20, 100, 45 * i))
}

function main() {
    context.fillStyle = "white";
    context.fillRect(0, 0, screenWidth, screenHeight);

    // 碰撞检查
    for (var i = 0; i < balls.length; i++) {
        var targetBall = balls[i];
        for (var j = i; j < balls.length; j++) {
            var testBall = balls[j];
            // 重叠检测
            if (isOverLapping(targetBall, testBall)){

            }
        }
    }
}
