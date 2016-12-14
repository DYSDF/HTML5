/**
 * Created by 断崖 on 2016/12/14.
 */

function getRandom(index, rang) {
    return Math.floor(Math.random() * rang) + (index - rang / 2);
}

var imgEl = document.getElementById("img");
imgEl.onload = randomCut;

var resultCanvas = document.getElementById("result");
var resultContext = resultCanvas.getContext("2d");

function randomCut() {
    var width = imgEl.naturalWidth;
    var height = imgEl.naturalHeight;
    var countX = 12;
    var countY = 6;

    resultCanvas.width = width;
    resultCanvas.style.width = width + "px";
    resultCanvas.height = height;
    resultCanvas.style.height = height + "px";

    var pointArray = [];
    var stepX = width / countX;
    var stepY = height / countY;

    for (var i = 0; i <= countX; i++) {
        pointArray[i] = [];
        for (var j = 0; j <= countY; j++) {
            pointArray[i].push({
                x: i * stepX,
                y: j * stepY
            });
        }
    }

    pointArray.forEach(function (xArray, xIndex) {
        xArray.forEach(function (point, yIndex) {
            var x = getRandom(point.x, stepX);
            var y = getRandom(point.y, stepY);

            if (xIndex > 0 && xIndex < countX) {
                point.x = x;
            }
            if (yIndex > 0 && yIndex < countY) {
                point.y = y;
            }
        })
    });

    var canvasEl = document.querySelector("#test");
    canvasEl.width = width;
    canvasEl.style.width = width + "px";
    canvasEl.height = height;
    canvasEl.style.height = height + "px";
    var context = canvasEl.getContext("2d");

    context.drawImage(imgEl, 0, 0);

    context.fillStyle = "red";
    context.strokeStyle = "green";
    context.beginPath();
    pointArray.forEach(function (item, xIndex) {
        item.forEach(function (point, yIndex) {
            context.moveTo(point.x, point.y);
            context.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            context.fill();

            if (pointArray[xIndex - 1]) {
                var pointX = pointArray[xIndex - 1][yIndex];
                context.moveTo(pointX.x, pointX.y);
                context.lineTo(point.x, point.y);
            }
            if (pointArray[xIndex][yIndex - 1]) {
                var pointY = pointArray[xIndex][yIndex - 1];
                context.moveTo(pointY.x, pointY.y);
                context.lineTo(point.x, point.y);
            }
            context.stroke();
        })
    });
    // context.fill();


    console.log(pointArray);
    var imgDataArray = [];
    for (var i = 0; i < pointArray.length - 1; i++) {
        for (var j = 0; j < pointArray[i].length - 1; j++) {
            var minX = Math.min(pointArray[i][j].x, pointArray[i][j + 1].x, pointArray[i + 1][j].x, pointArray[i + 1][j + 1].x);
            var minY = Math.min(pointArray[i][j].y, pointArray[i][j + 1].y, pointArray[i + 1][j].y, pointArray[i + 1][j + 1].y);
            var maxX = Math.max(pointArray[i][j].x, pointArray[i][j + 1].x, pointArray[i + 1][j].x, pointArray[i + 1][j + 1].x);
            var maxY = Math.max(pointArray[i][j].y, pointArray[i][j + 1].y, pointArray[i + 1][j].y, pointArray[i + 1][j + 1].y);

            var tmpCanvas = document.createElement("canvas");
            var tmpContext = tmpCanvas.getContext("2d");
            tmpCanvas.width = maxX - minX;
            tmpCanvas.height = maxY - minY;

            var imgData = context.getImageData(minX, minY, maxX - minX, maxY - minY);
            tmpContext.putImageData(imgData, 0, 0);

            tmpContext.globalCompositeOperation = "destination-in";

            tmpContext.fillStyle = "red";
            tmpContext.moveTo(pointArray[i][j].x - minX, pointArray[i][j].y - minY);
            tmpContext.lineTo(pointArray[i + 1][j].x - minX, pointArray[i + 1][j].y - minY);
            tmpContext.lineTo(pointArray[i + 1][j + 1].x - minX, pointArray[i + 1][j + 1].y - minY);
            tmpContext.lineTo(pointArray[i][j + 1].x - minX, pointArray[i][j + 1].y - minY);
            tmpContext.fill();

            // document.getElementById("body").appendChild(tmpCanvas);

            if (!imgDataArray[i]) imgDataArray[i] = [];
            imgDataArray[i][j] = {
                x: minX,
                y: minY,
                imgData: tmpCanvas.toDataURL()
            }
        }
    }

    imgDataArray.forEach(function (xArray) {
        xArray.forEach(function (position) {
            var img = document.createElement("img");
            img.src = position.imgData;

            document.getElementById("body").appendChild(img);
            resultContext.drawImage(img, position.x, position.y);
        })
    });

    console.log(imgDataArray);
}