const probeApp = require("./probeApp.js").probeApp;

let canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('draw-canvas');

let app = new probeApp(canvas);


