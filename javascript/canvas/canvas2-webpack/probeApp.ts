/**
 * @module  :   probeApp.ts
 * @author  :   Michael. A. Uman
 * @date    :   September 12, 2017
 * @date    :   April 11, 2020
 */

const fs = require('fs-web');

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

    private lastX : number;
    private lastY : number;

    private lastTop : number;
    private paneCount : number;

    constructor(c : HTMLCanvasElement) {
        console.log("probeApp()");

        this.canvasElement  = c;
        this.ctx            = <CanvasRenderingContext2D>c.getContext("2d");
        this.panesLoaded    = false;
        this.trackMove      = false;
        this.startDrag      = { x: 0, y: 0 };
        this.bgColor        = "lightgreen";
        this.paneNo         = -1;
        this.panes          = new Array();

        this.lastX          = 20;
        this.lastY          = 20;

        this.lastTop        = 0;
        this.paneCount      = 0;

        this.initEvents();
        this.resizeCanvas();

        // this.loadPanes();
    }

    private initEvents() : void {
        console.log("initEvents()");

        window.addEventListener("load", () => {
            console.log("load")
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

        // this.canvasElement.addEventListener("focus", (e: FocusEvent) => {
        //     console.log("Focus");
        // });

        setInterval( () => {
            this.onTimer();
        }, 500);
    }

    private onBeforeUnload() {
        console.log("onBeforeUnload()");
        this.savePanes();
    }

    addPane(pane: Pane) : void {
        this.panes.unshift(pane);
        // this.panes.push(pane);
        if (this.panes.length > 0) {
            this.panesLoaded = true;
        }
        this.drawCanvas();
    }

    private onKeyDown(e : KeyboardEvent) : void {

        switch (e.keyCode) {
            case 27:
                window.close();
                break;
            case 78:
                let paneTitle = ''.concat('Test Panel #' + (this.paneCount + 1).toString());
                let newPane : Pane = {
                    x: this.lastX,
                    y: this.lastY,
                    w: 200,
                    h: 200,
                    title: paneTitle,
                    color: "blue",
                    content: []
                };
                this.addPane( newPane );

                //this.paneToTop( this.panes.length - 1);

                this.paneCount += 1;

                this.lastX = this.lastX + 10;
                this.lastY = this.lastY + 10;

                // console.log(this.lastX);
                // console.log(this.lastY);

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
        }
    }

    /** Draw the timestamp into the canvas */
    private drawTimestamp() {
        let ts = new Date().toLocaleTimeString();
        this.ctx.fillStyle  = "black";
        this.ctx.font       = "18pt Helvectica";

        let xOff = (this.ctx.canvas.width - this.ctx.measureText(ts).width) / 2;
        this.ctx.fillText(ts, xOff, 18);
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
            // this.panes.forEach((pane) => {
            //     this.drawPane(pane);
            // });
            for (let i = this.panes.length - 1 ; i >= 0  ; i--) {
                this.drawPane(this.panes[i]);
            }
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
        fs.readFile('data', 'utf8', (err : any, data : string) => {
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

    private paneToTop(n : number) : void {
        if (n < this.panes.length) {
//            var topPane = this.panes.length - 1;
            var temp = this.panes[0];

            this.panes[0] = this.panes[n];
            this.panes[n] = temp;
        }
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
            this.paneToTop(this.paneNo);
            this.paneNo = 0;
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

