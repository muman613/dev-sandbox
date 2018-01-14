var $      = require('jquery');

var remote = require('electron').remote;
var dialog = remote.dialog;
var path   = require('path');
var Store  = require('electron-store');

const remoteTarget = require('./components/remote-target.js').remoteTarget;
const ucodeLabels  = require('./components/ucode-labels.js').ucodeLabels;

let target = new remoteTarget();
let labels = new ucodeLabels();
let store  = new Store();

let connButt    = document.getElementById('con-butt');
let readButt    = document.getElementById('read-butt');
let writeButt   = document.getElementById('write-butt');
let readVal     = document.getElementById('gbus-read-value');
let writeVal    = document.getElementById('gbus-write-value');
let symbolFile  = document.getElementById('symbol-file');
let symbolType  = document.getElementById('symbol-type');
let symbolDiv   = document.getElementById('symbol-table');
let conInfoDiv  = document.getElementById('con-info');

let customEvent = new Event('update-symbols');


store.set('shit', "shit");

window.onbeforeunload = (e) => {
    store.set('labelsPath', labels.file);
    //    alert('about to close!');
    //e.returnValue = answer;  // this will *prevent* the closing no matter what value is passed
    //if(answer) { remote.getCurrentWindow().destroy(); }  // this will close the app
};

document.addEventListener('update-symbols', function (e) {
    console.log("received update-symbols event!");
    symbolDiv.innerHTML = "";

    let table = "<table>";
    let tags = [];

    labels.forEach((value) => {
        table += "<tr><td>" + value.symbol.substring(0, 60) + "</td><td>0x" + value.address.toString(16) + "</td></tr>";
        tags.push(value.symbol);
    });

    table += "</table>";
    symbolDiv.innerHTML = table;
    $( "#gbus-read-address" ).autocomplete( {
        source: tags
    });
});

function updateConnButton() {
    if (target.connected) {
        connButt.innerText = "Disconnect";
        readButt.disabled = false;
        writeButt.disabled = false;
    } else {
        connButt.innerText = "Connect";
        readButt.disabled = true;
        writeButt.disabled = true;
    }
}

/** Handle the read button */
function onRead() {
    if (target.connected) {
        let address = document.getElementById('gbus-read-address').value;
        console.log("Reading address = %s", address);
        target.gbus_read_uint32(parseInt(address)).then((value) => {
            console.log("Read value = " + value.toString(16));
            readVal.value = "0x" + value.toString(16).toUpperCase();
        });
    } else {
        console.error("onRead() called when not connected!");
    }
}

function onWrite() {
    if (target.connected) {
        let address = document.getElementById('gbus-write-address').value;
        let value = writeVal.value;

        target.gbus_write_uint32(parseInt(address), parseInt(value)).then(() => {
            console.log("Write OK");
        });

        console.log("Writing address = %s", address);
    } else {
        console.error("onWrite() called when not connected!");
    }
}

/**
* connect/disconnect target.
*/
function conTarget() {
    if (target.connected) {
        target.disconnect()

        updateConnButton();
        updateConnInfo();
    } else {
        let targId = document.getElementById('ip-addr').value

        target.connect(targId).then((data) => {
            console.log("Connection established!")
//            document.getElementById('con-status').innerHTML = "Connected to Remote target " + targId

            updateConnButton()
            updateConnInfo();
            // target.identify().then((data) => {
            //     document.getElementById('con-type').innerHTML = data.toString()
            //     console.log(data.toString())
            //     target.version().then((version) => {
            //         console.log("version ", version);
            //     });
            //     // target.gbus_read_uint32(0x100000).then(function (data) {
            //     //     console.log(data.toString(16));
            //     // })
            // })
        }).catch(function () {
            console.log("Unable to connect!")
//            document.getElementById('con-status').innerHTML = "Unable to connected"
            updateConnButton()
            updateConnInfo();
        });
    }
}

function updateHeaderType(p) {
    if (path.extname(p) == ".h") {
        let base = path.basename(p, '.h');
        console.log("base = ", base);
        if (base.match(/^video/)) {
            console.log("Video header");
            symbolType.value = "video";
        } else if (base.match(/^demux/)) {
            console.log("Demux header");
            symbolType.value = "demux";
        } else if (base.match(/^audio/)) {
            console.log("Audio header");
            symbolType.value = "audio";
        } else {
            console.log("Unknown header type!")
        }
    } else {
        console.log("Not a header file!");
    }
}

function onFileChange(b) {
    let filePath = b.files[0].path;

    console.log("onFileChange()", filePath);

    updateHeaderType(filePath);
}

function onFileClick(b) {
    console.log("onFileClick()", b)
}

function onHeaderTypeChange(b) {
    console.log(b);
}

function getEngineBase(e) {
    switch (e) {
        case 'video':
            base = 0x100000;
            break;

        case 'audio':
            base = 0x120000;
            break;

        case 'demux':
            base = 0x140000;
            break;

        default:
            base = 0;
            break;
    }

    return base;
}

function loadSymbols(fname, base) {
    labels.pmbase = base;
    
    labels.parseHeader(fname).then(() => {
        console.log("loaded %d symbols", labels.size);
        document.dispatchEvent(customEvent);
    });
}

function onSymbolLoad(b) {
    let fullPath    = symbolFile.files[0].path;
    let headerType  = symbolType.value;
    let pmBase      = getEngineBase(headerType);

    console.log("onSymbolLoad()", fullPath, headerType);

    loadSymbols(fullPath, pmBase);
}


function updateConnInfo() {
    let status = target.status();

    if (status.isConnected) {
        let table = "";

        table = "<table width=\"100%\" border=\"1\">";
        table += "<tr><td>Remote Target IP</td><td>" + status.ipAddress + ":" + status.port.toString() + "</td></tr>";
        table += "<tr><td>Chip I/F Identity</td><td>" + status.chipId + "</td></tr>";
        table += "<tr><td>Chip Version</td><td>" + status.chipVersion + "</td></tr>";
        table += "</table>";
        conInfoDiv.innerHTML = table;
    } else {
        conInfoDiv.innerHTML = "<center><h4>Not connected</h4></center>"
    }
}

/** Execute on document load */
$( () => {
    $('#con-butt').on('click', conTarget);

    // let headerFile = store.get('labelsPath');
    // symbolFile.files[0].path = headerFile;
    // console.log("headerfile ", headerFile);

    updateConnButton();
    updateConnInfo();
});
