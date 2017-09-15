/**
 *
 */

"use strict";

interface tbImageInfo {
    filename:   string;
    img:        HTMLImageElement | null;
}

interface tbImageHash {
    [toolId : string] : tbImageInfo;
}

interface toolCb {
    (toolId : string): void;
}

interface tbToolInfo {
    toolId : string;
//  toolImage : string;
    toolTipText : string;
    callback : toolCb | undefined;
}

export class Toolbar {
    private imageHash   : tbImageHash;
    private toolArray   : Array<tbToolInfo>;
    private canvas      : HTMLCanvasElement | null;
    private drawCtx     : CanvasRenderingContext2D | null;

    constructor(canvasId : string) {
        console.log("Toolbar constructor");

        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        if (!this.canvas) {
            console.log("Unable to get canvas!");
            throw "Poop";
        }
        this.drawCtx = this.canvas.getContext("2d");
        this.imageHash = {};
        this.toolArray = [];
    }

    addTool(toolId : string,
            toolImgPath : string,
            toolTip : string,
            cb? : toolCb) : void
    {
        this.imageHash[toolId] = {
            filename: toolImgPath,
            img: null
        };
       let tbData = {
           toolId : toolId,
           toolTipText : toolTip,
           callback : cb
       };

       this.toolArray.push(tbData);
    }

    dump() : void {
        console.log(">> Toolbar dump <<");
        console.log("Dump of imageHash:");

        for (var key in this.imageHash) {
            console.log("toolId    = " + key);
            console.log("imagePath = " + this.imageHash[key].filename);
            console.log("image     = " + this.imageHash[key].img);
        }
    }

    shitFunction(i : number) {
        let num =2;
        console.log("i = ", i);
    }

    /** Load all images in the image hash and call callback when load completes */
    loadAllImages() : Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            let num = (Object.keys(this.imageHash)).length;

            for (var key in this.imageHash) {
                let newImage = new Image();

                newImage.onload = function () {
                    --num;
                    if (num == 0) {
                        console.log("all images loaded!");
                        resolve();
                    }
                }

                newImage.src = this.imageHash[key].filename;
                this.imageHash[key].img = newImage;
            }
        });
    }

};
