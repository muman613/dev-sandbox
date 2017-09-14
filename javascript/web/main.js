const {app, BrowserWindow}  = require('electron')
const ArgumentParser        = require('argparse').ArgumentParser;
const url                   = require('url') 
const path                  = require('path')  

let win = null;
let devtools = false;

/** Remove electron debugging options from commmandline args... */
function pruneCmdlineArgs() {
    let reservedOptions = [
      "--inspect",
      "--debug-brk",
    ];
  
    let exe = process.argv.shift();   // remove the electron/node executable
  
    for (let i = 0 ; i < reservedOptions.length ; i++) {
      if (process.argv[0].startsWith(reservedOptions[i])) {
        process.argv.shift(); // remove this option from the args
      }
    }
  
    process.argv.unshift(exe);  // push a dummy arg to beginning
}

/** Create the main window */
function createWindow() { 
   win = new BrowserWindow({width: 800, height: 600}) 

   if (devtools)
    win.toggleDevTools()

   win.loadURL(url.format ({ 
      pathname: path.join(__dirname, 'index.html'), 
      protocol: 'file:', 
      slashes: true 
   })) 
}  

pruneCmdlineArgs();

let parser = new ArgumentParser( {
    version: '1.0.0',
    addHelp: true,
    description: "Chip Interface test"
})

parser.addArgument( [ '--dev' ], { help: "Enable developer tools", action: 'storeTrue' })

let args = parser.parseArgs();

if (args.dev)
    devtools = true;

app.on('ready', createWindow);
// app.on('before-quit', (e) => {
  
//   console.log(e);
//   e.preventDefault();
// })