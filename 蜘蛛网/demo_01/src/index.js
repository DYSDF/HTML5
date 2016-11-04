/**
 * Created by 断崖 on 2016/11/4.
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

// 获取两点距离
function getDistance(ball1, ball2) {
    return Math.sqrt(
        Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2)
    )
}

/**
 * 简化球对象模型
 * @param x
 * @param y
 * @param v
 * @param d
 * @param r
 * @constructor
 */
function BallObj(x, y, v, d, r) {
    // 初始化参数
    this.x = x || 0;
    this.y = y || 0;
    this.vx = v * Math.cos(d) || 0;
    this.vy = v * Math.sin(d) || 0;
    this.r = r || 2
}

window.onload = function () {
    var canvasEl = document.querySelector("#canvas"),
        screenWidth = window.screen.availWidth * 0.6,
        screenHeight = window.screen.availHeight * 0.6;

    canvasEl.width = screenWidth * 2;
    canvasEl.style.width = screenWidth + "px";
    canvasEl.height = screenHeight * 2;
    canvasEl.style.height = screenHeight + "px";

    var context = canvasEl.getContext("2d"),
        mousePoint,
        balls = [],
        maxDistance = 150;

    function setMousePoint(e) {
        if (mousePoint == null) mousePoint = {};
        mousePoint.x = e.offsetX * (canvasEl.width / canvasEl.offsetWidth);
        mousePoint.y = e.offsetY * (canvasEl.height / canvasEl.offsetHeight);
    }

    canvasEl.onmouseover = function (e) {
        this.onmousemove = setMousePoint;
    };

    canvasEl.onmouseout = function () {
        mousePoint = null;
        this.onmousemove = null;
    };

    for (var i = 1; i <= 200; i++) {
        var random = Math.random();
        balls.push(
            new BallObj(
                Math.random() * canvasEl.width,
                Math.random() * canvasEl.height,
                1 + random,
                Math.PI * 2 * random,
                3
            )
        )
    }


    function main() {
        context.fillStyle = "white";
        context.fillRect(0, 0, canvasEl.width, canvasEl.height);

        for (var i = 0; i < balls.length; i++) {
            var ball_1 = balls[i];

            // 移动球
            ball_1.x += ball_1.vx;
            ball_1.y += ball_1.vy;

            // 边界检查
            if (ball_1.x - ball_1.r < 0) {
                ball_1.x = ball_1.r;
                ball_1.vx = Math.abs(ball_1.vx);
            }
            if (ball_1.x + ball_1.r > canvasEl.width) {
                ball_1.x = canvasEl.width - ball_1.r;
                ball_1.vx = -Math.abs(ball_1.vx);
            }
            if (ball_1.y - ball_1.r < 0) {
                ball_1.y = ball_1.r;
                ball_1.vy = Math.abs(ball_1.vy);
            }
            if (ball_1.y + ball_1.r > canvasEl.height) {
                ball_1.y = canvasEl.height - ball_1.r;
                ball_1.vy = -Math.abs(ball_1.vy);
            }

            // 与鼠标位置作用
            if (mousePoint != null) {
                if (getDistance(ball_1, mousePoint) < maxDistance * 2) {

                    // 球心连线与 x 轴正方向夹角
                    var radian_line = Math.atan2(mousePoint.y - ball_1.y, mousePoint.x - ball_1.x);

                    // 将球的位置坐标系的 x 轴旋转到与球心连线重合
                    var vx_1 = ball_1.vx * Math.cos(radian_line) + ball_1.vy * Math.sin(radian_line),
                        x_1 = ball_1.x * Math.cos(radian_line) + ball_1.y * Math.sin(radian_line),
                        y_1 = ball_1.y * Math.cos(radian_line) - ball_1.x * Math.sin(radian_line);

                    var x_2 = mousePoint.x * Math.cos(radian_line) + mousePoint.y * Math.sin(radian_line);

                    var nx_1 = x_1 + ((x_2 - x_1) / maxDistance) * Math.abs(vx_1);

                    // 复原球的坐标系
                    ball_1.x = nx_1 * Math.cos(-radian_line) + y_1 * Math.sin(-radian_line);
                    ball_1.y = y_1 * Math.cos(-radian_line) - nx_1 * Math.sin(-radian_line);

                    context.strokeStyle = "rgba(100,100,100," + (maxDistance * 2 - getDistance(mousePoint, ball_1)) / maxDistance / 2 + ")";
                    context.beginPath();
                    context.moveTo(ball_1.x, ball_1.y);
                    context.lineTo(mousePoint.x, mousePoint.y);
                    context.stroke();
                }
            }

            // 距离检测
            for (var j = i + 1; j < balls.length; j++) {
                var ball_2 = balls[j];
                // 球连线
                var distance = getDistance(ball_1, ball_2);
                if (distance < maxDistance) {
                    context.strokeStyle = "rgba(100,100,100," + (maxDistance - distance) / maxDistance + ")";
                    context.beginPath();
                    context.moveTo(ball_1.x, ball_1.y);
                    context.lineTo(ball_2.x, ball_2.y);
                    context.stroke();
                }
            }

            // 绘制球
            context.fillStyle = "red";
            context.beginPath();
            context.arc(ball_1.x, ball_1.y, ball_1.r, 0, 2 * Math.PI);
            context.fill();
        }

        requestAnimationFrame(arguments.callee);
    }

    main();
};
