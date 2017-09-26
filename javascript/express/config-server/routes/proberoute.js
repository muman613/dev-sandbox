/**
 *  smpProbe webApp router.
 *
 *  Handle all requests related to the probe web application.
 *
 */

const express = require('express');
const path    = require('path');

var probeRouter = new express.Router();

probeRouter.use(function timeLog(req, res, next) {
    console.log('Time: ', (new Date).toString());
    next();
});

probeRouter.get('/', function (req, res) {
    console.log("smpProbe webApp base URL");
    res.sendFile(path.join(__dirname, "../probe", "index.html"));
});

/**
 * Serve style.css & bundle.js from the probe directory.
 */
probeRouter.use(express.static(__dirname + "/../probe"), function (req, res) {
    console.log("Requested file " + req.originalUrl + " not found!");
    res.sendStatus(404);
});

module.exports = probeRouter;
