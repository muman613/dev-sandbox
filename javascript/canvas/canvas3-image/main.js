/**
 * main.js
 */
const   iconWidth = 24,
        iconHeight = 24;

 /** Execute when the window is loaded */
window.onload = window.onresize = function() {
    let canvasElement = document.getElementById("draw-canvas");
    let drawCtx = canvasElement.getContext("2d");

    let imageHash = {
        "Camera" : {
            filename: "Camera.png",
            img: null,
        },
        "Connect": {
            filename: "Connect.png",
            img: null,
        },
        "Disconnect": {
            filename: "Disconnect.png",
            img: null,
        },
        "Exit": {
            filename: "Exit button.png",
            img: null,
        },
        "OpenFile": {
            filename: "Open file.png",
            img: null,
        },
        "Prefs": {
            filename: "Preferences.png",
            img: null,
        }
    };

    /** Resize the canvas */
    drawCtx.canvas.width = window.innerWidth;
    drawCtx.canvas.height = window.innerHeight;

    let imagesLoaded = false;

    /** Load all images in the image hash and call callback when load completes */
    function loadAllImages(cb) {
        let num = Object.keys(imageHash).length;

        for (var key in imageHash) {
            let newImage = new Image();

            newImage.onload = function () {
                --num;
                if (num == 0) {
                    cb();
                }
            }

            newImage.src = "toolbar/" + imageHash[key].filename;
            imageHash[key].img = newImage;
        }
    }

    /** Redraw on the timer event */
    function onTimer() {
        console.log("onTimer()");
        drawFrame();
    }

    function drawFrame() {
        drawCtx.fillStyle = "lightblue";
        drawCtx.fillRect(0, 0, drawCtx.canvas.width, drawCtx.canvas.height);

        if (imagesLoaded) {
            let x = 0;
            for (var key in imageHash) {
//              console.log("Drawing image " + key);
                drawCtx.strokeStyle = "black";
                // drawCtx.strokeRect((x * iconWidth) + 8, 8, iconWidth, iconHeight);
                // drawCtx.drawImage(imageHash[key].img, (x * iconWidth) + 8, 8);
                drawCtx.strokeRect((x * (iconWidth + 4)) + 8, 8, iconWidth, iconHeight);
                drawCtx.drawImage(imageHash[key].img, (x * (iconWidth + 4)) + 8, 8);
                x++;
            }
        } else {
            drawCtx.fillStyle = "black";
            drawCtx.font = "12pt Sans";
            drawCtx.fillText("Please Wait...", 40, 40);
        }
    }


    console.log("window loaded");

    loadAllImages(() => {
        console.log("ALL IMAGES LOADED!");
        imagesLoaded = true;
        drawFrame();
    });

    drawFrame();

    setInterval(() => {
        onTimer();
    }, 1000);

}