/**
 * Created by 断崖 on 2016/12/14.
 */

function getRandom(index, rang) {
    return Math.floor(Math.random() * rang) + (index - rang / 2);
}

function randomCut() {
    var imgEl = document.getElementById("img");

    var width = imgEl.naturalWidth;
    var height = imgEl.naturalHeight;
    var countX = 12;
    var countY = 6;

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

    // context.fillStyle = "red";
    // context.strokeStyle = "green";
    // context.beginPath();
    // pointArray.forEach(function (item, xIndex) {
    //     item.forEach(function (point, yIndex) {
    //         context.moveTo(point.x, point.y);
    //         context.arc(point.x, point.y, 2, 0, 2 * Math.PI);
    //         context.fill();
    //
    //         if (pointArray[xIndex - 1]) {
    //             var pointX = pointArray[xIndex - 1][yIndex];
    //             context.moveTo(pointX.x, pointX.y);
    //             context.lineTo(point.x, point.y);
    //         }
    //         if (pointArray[xIndex][yIndex - 1]) {
    //             var pointY = pointArray[xIndex][yIndex - 1];
    //             context.moveTo(pointY.x, pointY.y);
    //             context.lineTo(point.x, point.y);
    //         }
    //         context.stroke();
    //     })
    // });
    // context.fill();


    for (var i = 0; i < pointArray.length; i++) {
        for (var j = 0; j < pointArray[i].length; j++) {

        }
    }

    return pointArray;
}
console.log(randomCut());