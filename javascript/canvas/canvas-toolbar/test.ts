

const Toolbar = require("./toolbar.js").Toolbar;

let tb = new Toolbar("draw-canvas");

tb.addTool("connect", "toolbar/Connect.png");
tb.addTool("disconnect", "toolbar/Disconnect.png");
tb.addTool("camera", "toolbar/Camera.png");


tb.loadAllImages().then(() => {
    tb.dump();
});
