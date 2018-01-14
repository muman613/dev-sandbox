/**
 * @module  :   probeApp.ts
 * @author  :   Michael. A. Uman
 * @date    :   September 12, 2017
 */

const fs = require('fs');

interface Point {
    x: number;
    y: number;
};

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface Pane {
    title: string;          // Title of Pane
    x: number;              // X-Pos
    y: number;              // Y-Pos
    w: number;              // Width
    h: number;              // Height
    color: string;          // Background color
    content: Array<string>; // Array of pane contents
}

/** Probe Application object */

export class probeApp {
    private canvasElement : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private panesLoaded : boolean;
    private trackMove : boolean;
    private startDrag : Point;
    private paneNo : number;
    private panes : Array<Pane>;
    private bgColor : string;

    constructor(c : HTMLCanvasElement) {
        console.log("probeApp()");

        this.canvasElement  = c;
        this.ctx            = <CanvasRenderingContext2D>c.getContext("2d");
        this.panesLoaded    = false;
        this.trackMove      = false;
        this.startDrag      = { x: 0, y: 0 };
        this.bgColor        = "lightgreen";
        this.paneNo         = -1;

        this.initEvents();
        this.resizeCanvas();

        this.loadPanes();
    }

    private initEvents() : void {
        console.log("initEvents()");

        window.addEventListener("load", () => {
            this.resizeCanvas()
        });
        window.addEventListener("resize", () => {
             this.resizeCanvas()
        });

        /** Hook up the mouse up/down/move events */
        window.addEventListener("mousedown", (e : MouseEvent) => {
            this.onMouseDown(e);
        });
        window.addEventListener("mouseup", (e : MouseEvent) => {
            this.onMouseUp(e);
        });
        window.addEventListener("mousemove", (e: MouseEvent) => {
            this.onMouseMove(e);
        });

        window.addEventListener("beforeunload", () => {
            this.onBeforeUnload();
        });

        this.canvasElement.addEventListener("keydown", (e: KeyboardEvent) => {
            this.onKeyDown(e);
        });

        setInterval( () => {
            this.onTimer();
        }, 500);
    }

    private onBeforeUnload() {
        console.log("onBeforeUnload()");
        this.savePanes();
    }

    private onKeyDown(e : KeyboardEvent) : void {
        console.log(e);

        switch (e.keyCode) {
            case 27:
                window.close();
                break;

            default:
                console.log(e);
                break;
        }
    }

    private onTimer() : void {
        console.log("onTimer()");
        if (this.trackMove == false) {
            this.drawCanvas();
//            this.drawTimestamp();
        }
    }

    /** Draw the timestamp into the canvas */
    private drawTimestamp() {
        let ts = new Date().toLocaleTimeString();
        this.ctx.fillStyle  = "black";
        this.ctx.font       = "10pt mono";
        this.ctx.fillText(ts, 2, 12);
    }

    private resizeCanvas() : void {
        console.log("resizeCanvas()");

        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;

        // if (!this.panesLoaded) {
        //     this.loadPanes();
        // }

        this.drawCanvas();
    };

    drawSunkenRect(rect : Rect) {
        this.ctx.strokeStyle = "black";
        this.ctx.beginPath();
        this.ctx.moveTo( rect.x, rect.y + rect.h);
        this.ctx.lineTo( rect.x, rect.y);
        this.ctx.lineTo( rect.x + rect.w, rect.y );
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo( rect.x + rect.w, rect.y);
        this.ctx.lineTo( rect.x + rect.w, rect.y + rect.h);
        this.ctx.lineTo( rect.x, rect.y + rect.h);
        this.ctx.stroke();

    }

    drawRaisedRect(rect: Rect) : void {
        this.ctx.strokeStyle = "white";
        this.ctx.beginPath();
        this.ctx.moveTo( rect.x, rect.y + rect.h);
        this.ctx.lineTo( rect.x, rect.y);
        this.ctx.lineTo( rect.x + rect.w, rect.y );
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.moveTo( rect.x + rect.w, rect.y);
        this.ctx.lineTo( rect.x + rect.w, rect.y + rect.h);
        this.ctx.lineTo( rect.x, rect.y + rect.h);
        this.ctx.stroke();
    }

    /* Draw a single pane */
    drawPane(pane: Pane) : void {
        this.ctx.fillStyle = pane.color;
        this.ctx.fillRect( pane.x, pane.y, pane.w, pane.h);

        this.ctx.font = "10pt mono";
        this.ctx.fillStyle = "lightgrey";
        this.ctx.fillRect( pane.x, pane.y, pane.w, 16);

        this.ctx.fillStyle = "black";
        let dims = this.ctx.measureText(pane.title);
        this.ctx.fillText(pane.title, pane.x + ((pane.w - dims.width)/2), pane.y + 12)

        this.drawRaisedRect( {
            x: pane.x,
            y: pane.y,
            w: pane.w,
            h: pane.h,
        });

        if (pane.content) {
            // create clip rect.

            this.ctx.save();

            this.ctx.beginPath();
            this.ctx.rect( pane.x, pane.y, pane.w, pane.h );
            this.ctx.clip();

            this.ctx.fillStyle = "white";
            this.ctx.font      = "9pt mono";

            for (let x = 0 ; x < pane.content.length ; x++) {
                let line = pane.content[x];

                this.ctx.fillText(line, pane.x + 4, pane.y + 30 + (x * 14));
            }

            this.ctx.restore();
        }
    }

    /** Clear the canvas to the background color */
    clearCanvas() : void {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    /** Draw all the panes */
    drawCanvas() : void {
        this.clearCanvas();

        if (this.panes) {
            this.panes.forEach((pane) => {
                this.drawPane(pane);
            });
        }

        this.drawTimestamp();
    }

    /** Determine which pane the point is in */
    whichPane(pos : Point) {
        if (this.panesLoaded) {
            for (let x = 0 ; x < this.panes.length ; x++) {
                let pane = this.panes[x];

                if ((pos.x >= pane.x) && (pos.x <= (pane.x + pane.w))) {
                    if ((pos.y >= pane.y) && (pos.y <= (pane.y + pane.h))) {
                        return x;
                    }
                }
            }
        }

        return -1;
    }

    private loadPanes() {
        fs.readFile(__dirname + "/panes.json", 'utf8', (err : any, data : string) => {
            if (err) {
                console.log("ERROR : " + err);
                return;
            }

            this.panes = JSON.parse(data);
            this.panesLoaded = true;

            // if (cb) {
            //     cb();
            // } else {
            this.drawCanvas();
            // }
        });
    }

    /** Save the pane layout to a JSON file */
    private savePanes() : void {
        console.log("savePaneLayout()");
        fs.writeFile("panes.json", JSON.stringify(this.panes, null, 4), function (err : any) {
            if (err)
                console.log(err);
        });
    }

    /** Get the mouse position relative to the canvas */
    private getMousePos(e : MouseEvent) : Point {
        var rect = this.canvasElement.getBoundingClientRect();

        return ( { x: Math.round(e.clientX - rect.left) , y: Math.round(e.clientY - rect.top) });
    }

    private onMouseUp(e: MouseEvent) : void {
        let mousePos = this.getMousePos(e);

        console.log("onMouseUp() ", mousePos.x, mousePos.y);
        //this.canvasElement.onmousemove = null;
//      this.canvasElement.removeEventListener('mousemove', this.onMouseMove);
        this.trackMove = false;
        this.paneNo = -1;
        this.startDrag = { x:0, y:0 };
    }

    onMouseDown(e : MouseEvent) : void {
        let mousePos = this.getMousePos(e);

        console.log("onMouseDown() ", mousePos.x, mousePos.y);

        this.paneNo = this.whichPane(mousePos);
        console.log("in pane ", this.paneNo);

        if (this.paneNo >= 0) {
//            this.canvasElement.onmousemove = this.onMouseMove;
//            this.canvasElement.addEventListener('mousemove', this.onMouseMove);
            this.startDrag = mousePos;
            this.trackMove = true;
        }
    }

    onMouseMove(e : MouseEvent) : void {
        if (this.trackMove) {
            let mousePos = this.getMousePos(e);

            console.log("onMouseMove() ", mousePos.x, mousePos.y);

            let diff = {
                x: mousePos.x - this.startDrag.x,
                y: mousePos.y - this.startDrag.y
            };

            this.panes[this.paneNo].x += diff.x;
            this.panes[this.paneNo].y += diff.y;

            this.startDrag = mousePos;

            console.log("diff = ", diff);

            this.drawCanvas();
        }
    }

}

