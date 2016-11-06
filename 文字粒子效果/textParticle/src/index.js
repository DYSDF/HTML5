/**
 * Created by Jay on 16/11/5.
 */


window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (fnObj) {
            window.setTimeout(fnObj, 1000 / 60)
        }
})();


// 定义球对象
function BallObj(sx, sy, sr, ex, ey, er) {
    // 初始化参数
    this.x = sx || 0;
    this.y = sy || 0;
    this.r = sr || 10;

    this.sx = sx || 0;
    this.sy = sy || 0;
    this.sr = sr || 10;

    this.ex = ex || 0;
    this.ey = ey || 0;
    this.er = er || 10;
}


// 获取文字像素信息
function serializationText(text, width, height) {
    var canvas = document.createElement("canvas"),
        ct = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ct.fillStyle = "rgba(255,0,0,1)";
    ct.font = "200px 微软雅黑";
    ct.textAlign = "center";
    ct.textBaseline = "middle";
    ct.fillText(text, canvas.width / 2, canvas.height / 2);

    return ct.getImageData(0, 0, width, height);
}


window.onload = function () {
    // 初始化
    var screenWidth = window.screen.availWidth * 0.6,
        screenHeight = window.screen.availHeight * 0.6,
        canvasEl = document.querySelector("#canvas"),
        context = canvasEl.getContext("2d"),
        balls = [],
        isEnd = false,
        isPause = false,
        isReverse = false,
        time = null;

    // 设置canvas参数
    canvasEl.width = screenWidth;
    canvasEl.style.width = screenWidth + "px";
    canvasEl.height = screenHeight;
    canvasEl.style.height = screenHeight + "px";

    // 将文字序列化成小球
    function setBalls() {
        balls = [];

        var text = document.querySelector("#text_input").value;
        var imgData = serializationText(text, screenWidth, screenHeight);
        // 设置扫描间隔
        for (var i = 0; i < imgData.width; i += 8) {
            for (var j = 0; j < imgData.height; j += 8) {
                var pos = (imgData.width * j + i) * 4,
                    colorR = imgData.data[pos];

                // 当像素是文字像素时
                if (colorR > 240) {
                    var x = Math.random() * screenWidth;
                    var y = Math.random() * screenHeight;
                    var r = Math.pow(Math.random() / 0.5, 2) * 3;
                    var dx = i;
                    var dy = j;
                    var dr = 3;
                    balls.push(new BallObj(x, y, r, dx, dy, dr));
                }
            }
        }
    }

    // 主函数
    function main() {
        // 清空画布
        context.clearRect(0, 0, screenWidth, screenHeight);

        // 画小球
        context.fillStyle = "red";
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];

            context.beginPath();
            if (isReverse) {
                ball.x = ball.x + (ball.sx - ball.x) * 0.1;
                ball.y = ball.y + (ball.sy - ball.y) * 0.1;
                ball.r = ball.r + (ball.sr - ball.r) * 0.1;

                if (Math.abs(ball.x - ball.sx) < 0.001) {
                    isEnd = true;
                }
            } else {
                ball.x = ball.x + (ball.ex - ball.x) * 0.1;
                ball.y = ball.y + (ball.ey - ball.y) * 0.1;
                ball.r = ball.r + (ball.er - ball.r) * 0.1;

                if (Math.abs(ball.x - ball.ex) < 0.001 && !isPause) {
                    isPause = true;
                    setTimeout(function () {
                        isReverse = true;
                    }, 1000)
                }
            }
            context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
            context.fill();
        }

        if (!isEnd) {
            window.requestAnimationFrame(arguments.callee);
        }
    }


    document.querySelector("#restart").onclick = function () {
        if (isEnd) {
            isEnd = false;
            isPause = false;
            isReverse = false;
            setBalls();
            main();
        }
    };

    setBalls();
    main();
};
