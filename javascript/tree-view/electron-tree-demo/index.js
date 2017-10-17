/**
 *  main entry point for Electron
 */

const   {app, BrowserWindow} = require('electron');
const   path  = require('path');
const   url   = require('url');
//const   fs    = require('fs');

let     mainWindow = undefined;

//console.log("OK " + __dirname);

/** Create the browser window */
function createWindow() {
    mainWindow = new BrowserWindow( { width: 800, height: 600 } );

    mainWindow.on('closed', () => {
        //console.log("mainwindow closed!");
        mainWindow = null;
    });

    let loadURL = url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
    });

    //console.log("loading " + loadURL.toString());
    mainWindow.loadURL(loadURL);
}


app.on('ready', createWindow);


