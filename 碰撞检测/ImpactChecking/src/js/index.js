/**
 * Created by 断崖 on 2016/10/31.
 * 运用二维向量解决运动计算
 * 坐标系：x 正坐标朝右，y 正坐标朝下，角度正方向为顺时针
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

function BallObj(x, y, r, v, d, m) {
    // 初始化参数
    this.x = x || 0;
    this.y = y || 0;
    this.r = r || 10;
    this.vx = v * Math.cos(d) || 0;
    this.vy = v * Math.sin(d) || 0;
    this.m = m || 10;
}

function isOverLapping(ball1, ball2) {
    return Math.sqrt(
            Math.pow(Math.abs(ball1.x - ball2.x), 2)
            + Math.pow(Math.abs(ball1.y - ball2.y), 2)
        ) < (ball1.r + ball2.r)
}

window.onload = function () {
    var canvasEl = document.querySelector("#canvas"),
        screenWidth = window.screen.availWidth * 0.6,
        screenHeight = window.screen.availHeight * 0.6;

    canvasEl.width = screenWidth;
    canvasEl.style.width = screenWidth;
    canvasEl.height = screenHeight;
    canvasEl.style.height = screenHeight;

    var context = canvasEl.getContext("2d"),
        balls = [];

    // balls.push(new BallObj(
    //     10,
    //     100,
    //     10,
    //     10,
    //     0,
    //     1000
    // ));
    // balls.push(new BallObj(
    //     screenWidth - 20,
    //     100,
    //     20,
    //     5,
    //     Math.PI,
    //     80000
    // ));

    for (var i = 1; i <= 10; i++) {
        var random = Math.random();
        balls.push(new BallObj(
            screenWidth * random, // x
            screenHeight * random, // y
            5 + 20 * random, // r
            2 + 2 * random, // v
            45 / 180 * Math.PI * i, 10, // d
            5 + 8000 * random // m
        ));
    }

    function main() {
        context.fillStyle = "white";
        context.fillRect(0, 0, screenWidth, screenHeight);

        for (var i = 0; i < balls.length; i++) {
            var ball_1 = balls[i];

            // 移动球
            ball_1.x += ball_1.vx;
            ball_1.y += ball_1.vy;

            // 碰撞检查
            // 知识不够，只能循环迭代检测
            for (var j = i + 1; j < balls.length; j++) {
                var ball_2 = balls[j];
                // 重叠检测
                if (isOverLapping(ball_1, ball_2)) {
                    // 球心连线与 x 轴正方向夹角
                    var line = [ball_2.x - ball_1.x, ball_2.y - ball_1.y];
                    var radian_line = Math.atan2(line[1], line[0]);

                    // 将球的速度坐标系的 x 轴旋转到与球心连线重合
                    var vx_1 = ball_1.vx * Math.cos(radian_line) + ball_1.vy * Math.sin(radian_line),
                        vy_1 = ball_1.vy * Math.cos(radian_line) - ball_1.vx * Math.sin(radian_line);

                    var vx_2 = ball_2.vx * Math.cos(radian_line) + ball_2.vy * Math.sin(radian_line),
                        vy_2 = ball_2.vy * Math.cos(radian_line) - ball_2.vx * Math.sin(radian_line);

                    // 排除同向远离情况
                    if (vx_1 - vx_2 <= 0) break;

                    // 根据动量定理及动能定理求解 x 方向上的速度变化
                    var nvx_1 = (ball_1.m - ball_2.m) / (ball_1.m + ball_2.m) * (vx_1 - vx_2) + vx_2;
                    var nvx_2 = 2 * ball_1.m / (ball_1.m + ball_2.m) * (vx_1 - vx_2) + vx_2;

                    // 复原球的坐标系
                    ball_1.vx = nvx_1 * Math.cos(-radian_line) + vy_1 * Math.sin(-radian_line);
                    ball_1.vy = vy_1 * Math.cos(-radian_line) - nvx_1 * Math.sin(-radian_line);

                    ball_2.vx = nvx_2 * Math.cos(-radian_line) + vy_2 * Math.sin(-radian_line);
                    ball_2.vy = vy_2 * Math.cos(-radian_line) - nvx_2 * Math.sin(-radian_line);
                }
            }

            // 边界检查
            if (ball_1.x - ball_1.r < 0) {
                ball_1.x = ball_1.r;
                ball_1.vx = Math.abs(ball_1.vx);
            }
            if (ball_1.x + ball_1.r > screenWidth) {
                ball_1.x = screenWidth - ball_1.r;
                ball_1.vx = -Math.abs(ball_1.vx);
            }
            if (ball_1.y - ball_1.r < 0) {
                ball_1.y = ball_1.r;
                ball_1.vy = Math.abs(ball_1.vy);
            }
            if (ball_1.y + ball_1.r > screenHeight) {
                ball_1.y = screenHeight - ball_1.r;
                ball_1.vy = -Math.abs(ball_1.vy);
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
