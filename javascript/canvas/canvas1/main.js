const fs     = require('fs');
const canvas = document.getElementById('draw-canvas');
const ctx    = canvas.getContext('2d');


var   panesLoaded = false;
var   trackMove   = false;

var   startDrag = { x:0, y:0 };
var   paneNo    = -1;

function drawSunkenRect(rect) {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo( rect.x, rect.y + rect.h);
    ctx.lineTo( rect.x, rect.y);
    ctx.lineTo( rect.x + rect.w, rect.y );
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo( rect.x + rect.w, rect.y);
    ctx.lineTo( rect.x + rect.w, rect.y + rect.h);
    ctx.lineTo( rect.x, rect.y + rect.h);
    ctx.stroke();

}

function drawRaisedRect(rect) {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo( rect.x, rect.y + rect.h);
    ctx.lineTo( rect.x, rect.y);
    ctx.lineTo( rect.x + rect.w, rect.y );
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo( rect.x + rect.w, rect.y);
    ctx.lineTo( rect.x + rect.w, rect.y + rect.h);
    ctx.lineTo( rect.x, rect.y + rect.h);
    ctx.stroke();
}

/* Draw a single pane */
function drawPane(pane) {
    ctx.fillStyle = pane.color;
    ctx.fillRect( pane.x, pane.y, pane.w, pane.h);
//  ctx.moveTo( pane.x + 5, pane.y + 2);
    ctx.font = "10pt mono";

    ctx.fillStyle = "lightgrey";
    ctx.fillRect( pane.x, pane.y, pane.w, 16);

    ctx.fillStyle = "black";
    let dims = ctx.measureText(pane.title);
    ctx.fillText(pane.title, pane.x + ((pane.w - dims.width)/2), pane.y + 12)

    drawRaisedRect( {
        x: pane.x,
        y: pane.y,
        w: pane.w,
        h: pane.h,
    });

    if (pane.content) {
        // create clip rect.

        ctx.save();

        ctx.beginPath();
        ctx.rect( pane.x, pane.y, pane.w, pane.h );
        ctx.clip();

        ctx.fillStyle = "white";
        ctx.font      = "9pt mono";

        for (let x = 0 ; x < pane.content.length ; x++) {
            let line = pane.content[x];

            ctx.fillText(line, pane.x + 4, pane.y + 30 + (x * 14));
        }

        ctx.restore();
    }
}

let panes = new Array();

/** Determine which pane the mouse is down in */
function whichPane(pos) {
//    let result = -1;

    if (panesLoaded) {
        for (let x = 0 ; x < panes.length ; x++) {
            let pane = panes[x];

            if ((pos.x >= pane.x) && (pos.x <= (pane.x + pane.w))) {
                if ((pos.y >= pane.y) && (pos.y <= (pane.y + pane.h))) {
//                  console.log("in pane # ", x);
                    return x;
                }
            }
        }
    }

    return -1;
}

function clearCanvas() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/** Draw all the panes */
function drawCanvas() {
    clearCanvas();

    panes.forEach((pane) => {
        drawPane(pane);
    })
}

function loadPanes() {
    fs.readFile(__dirname + "/panes.json", 'utf8', (err, data) => {
        if (err) {
            console.log("ERROR : " + err);
            return;
        }

        panes = JSON.parse(data);
        panesLoaded = true;
        drawCanvas();
    });
}

function tick() {
    // update the panes
    drawCanvas();
}

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();

    return ( { x: Math.round(e.clientX - rect.left) , y: Math.round(e.clientY - rect.top) });
}

function onMouseUp(e) {
    let mousePos = getMousePos(e);

    console.log("onMouseUp() ", mousePos.x, mousePos.y);
    canvas.onmousemove = null;
    trackMove = false;
    paneNo = -1;
    startDrag = { x:0, y:0 };
}

function onMouseDown(e) {
    let mousePos = getMousePos(e);

    console.log("onMouseDown() ", mousePos.x, mousePos.y);

    paneNo = whichPane(mousePos);
    console.log("in pane ", paneNo);

    if (paneNo >= 0) {
        canvas.onmousemove = onMouseMove;
        startDrag = mousePos;
        trackMove = true;
    }
}

function onMouseMove(e) {
    let mousePos = getMousePos(e);

    console.log("onMouseMove() ", mousePos.x, mousePos.y);

    let diff = { x: mousePos.x - startDrag.x, y: mousePos.y - startDrag.y };

    panes[paneNo].x += diff.x;
    panes[paneNo].y += diff.y;

    startDrag = mousePos;

    console.log("diff = ", mousePos.x - startDrag.x, mousePos.y - startDrag.y);
}

window.onload = window.onresize = function() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    canvas.onmousedown = onMouseDown;
    canvas.onmouseup   = onMouseUp;
//    canvas.ondrag      = onMouseDrag;
//    canvas.onmousemove = onMouseMove;

    console.log("ok");

    if (!panesLoaded) {
        loadPanes();
    }

    drawCanvas();

    setInterval( tick, 100);
};

/** Save the pane layout to a JSON file */
function savePaneLayout() {
    console.log("savePaneLayout()");
    fs.writeFile("panes.json", JSON.stringify(panes, null, 4), function (err) {
        if (err)
            console.log(err);
    });
}

/** Handle unload event by saving panel layout */
window.onbeforeunload = function(e) {
    console.log("onbeforeunload");
    if (panesLoaded) {
        savePaneLayout();
    }
}

canvas.onkeydown = function (e) {
    console.log(e);
    switch (e.keyCode) {
        case 27:
            window.close();
            break;
        default:
            break;
    }
//    window.close();
}