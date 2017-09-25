/**
 *  @module     :   config-server.js
 *  @author     :   Michael Uman
 */

"use strict";

const express       = require('express');
const fs            = require('fs');
const xml2js        = require('xml2js');
const os            = require('os');
const pug           = require('pug');
const cors          = require('cors');

/** Some application constants */
const homeDir       = os.homedir();
const configPath    = getConfigfilePath();
const serverPort    = 3000;
let   configsLoaded = false;

/** Get an XML parser */
let   xmlParser     = new xml2js.Parser();

function getConfigfilePath() {
    let configFilePath = undefined;

    let platform = os.platform();
    console.log("running on platform " + platform);
    switch (platform) {
        case "win32":
            configFilePath = homeDir + "\\.smpProbe\\config\\";
            break;

        case "linux":
            configFilePath = homeDir + "/.smpProbe/config/";
            break;

        default:
            console.error("Unsupported platform!");
            break;
    }

    return configFilePath;
}

function getConfigInfo(path, name) {
    let configName = path + name;

    return new Promise((resolve, reject) => {
        let self = this;
        let configObj = {
            "filePath": configName,
            "fileName": name,
            "type": undefined,
            "modified": undefined,
            "description": "N/A"
        };

        let stats = fs.statSync(configName);

        configObj.modified = stats.mtime;

        fs.readFile(configName, (err, data) => {
//            console.log(configName);
            if (err) {
                console.log(err);
                reject(err);
            } else {
                /** Parse config file to extract type and decription */
                xmlParser.parseString(data.toString(), (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
    //              console.log(result);
                    let configType =Object.keys(result)[0];

                    if (configType == 'include') {
                        configObj.type = 'include';
                    } else if (configType == 'probe_config') {
                        configObj.type = 'config';

                        if (result.probe_config.manifest) {
                            configObj.description = result.probe_config.manifest[0].description[0];
                        }
                    }

                    resolve( configObj );
                });
            }
        });
    });
}

/** Get config file array */
function getConfigFiles(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
//              console.log(err);
                reject(err);
            } else {
                let promiseArray = [];

                files.forEach(function(configFilename) {
                    if (configFilename.endsWith(".xml")) {
//                      console.log("processing file " + configFilename);
                        promiseArray.push(getConfigInfo( configPath, configFilename));
                    }
                }, this);

                Promise.all(promiseArray).then((results) => {
//                  console.log(results);
                    resolve(results);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    });
}

function getConfigFileArray() {
    let configArray = [];

    if (configsLoaded) {
        configFileArray.forEach((e) => {
            if (e.type == "config") {
                configArray.push( {
                    "fileName": e.fileName,
                    "modified": e.modified,
                    "description": e.description
                });
            }
        });
    }

    return configArray;
}

function getIncludeFileArray() {
    let includeArray = [];

    if (configsLoaded) {
        configFileArray.forEach((e) => {
            if (e.type == "include") {
                includeArray.push( {
                    "fileName": e.fileName,
                    "modified": e.modified,
//                  "description": e.description
                });
            }
        });
    }

    return includeArray;
}

let app = express();
let io = undefined;


let configFileArray = [];

app.set('views', __dirname + "/templates/");
app.set('view engine', 'pug');

app.use(cors());

console.log("Searching for config files @ " + configPath);
getConfigFiles(configPath).then((files) => {
//  console.log(files);
    configFileArray = files;
    configsLoaded   = true;

    /** Set up a filesystem watch on the configuration directory */
    fs.watch(configPath, "utf8", (event, filename) => {
        console.log("event : " + event + " filename : " + filename);
    });

}).catch((reason) => {
    switch (reason.code) {
        case 'ENOENT':
            console.log("WARNING: Unable to locate probe configuration files!");
            break;
        default:
            console.log(reason);
            break;
    }
});


app.use("/config/files", (req, res) => {
    if (configsLoaded) {
        res.send(getConfigFileArray());
    } else {
        res.send("No configuration files found!");
    }
});
app.use("/config/includes", (req, res) => {
    if (configsLoaded) {
        res.send(getIncludeFileArray());
    } else {
        res.send("No configuration files found!");
    }
});

app.use("/config/get/:file", (req, res) => {
    let fileName = req.params.file;
    let configIndex = -1;

    for (let x = 0 ; x < configFileArray.length ; x++) {
        if (configFileArray[x].fileName == fileName) {
            configIndex = x;
            break;
        }
    }
    if (configIndex != -1) {
//      console.log("Getting file " + fileName);
        let fileBody = fs.readFileSync(configFileArray[configIndex].filePath);
        res.setHeader("content-type", "text/xml");
        res.send(fileBody.toString());
    } else {
        res.send("Invalid filename\n");
    }
});

app.use('/config', (req, res) => {
    if (configsLoaded) {
//        res.send(configFileArray);
        let URL = "http://" + req.headers.host;

        res.render('configs', {
            "configCount": getConfigFileArray().length,
            "includeCount": getIncludeFileArray().length,
            "configURL": URL + "/config/files",
            "includeURL": URL + "/config/includes",
            "osHostName": os.hostname(),
            "osArch": os.arch()
        });
    } else {
        res.send("No configuratons found!");
    }
});

app.use(express.static(__dirname + "/public"));
app.use('/', (req, res) => {
    //res.send("OK");
    // res.render('template', {
    //     "title": "Configuration Server",
    //     "message": "Welcome to the configuration server!"
    //  });
    res.sendFile(__dirname + "/public/index.html");
});


let server = app.listen(serverPort, function () {
    console.log("HTTP Server waiting on port " + server.address().port);
    /** Attach socket.io handler */
    io = require('socket.io')(server);
    console.log(io);

    io.on('connection', function (client) {
        console.log("Client connected...");

        client.emit('message', "Hello client");

        client.on('send', function (data) {
            console.log("received send packet!");
            let results = [ 0xdeadbeef, 0xdeadbeef, 0xdeadbeef, 0xdeadbeef ];
            client.emit("response", results);
        });

        client.on('disconnect', function () {
            console.log("client disconnected!");
        });
    });

    // io.on('disconnect', function () {
    //     console.log("client disconnected!");
    // });

}).on('error', (err) => {
    switch (err.code) {
        case 'EADDRINUSE':
            console.error("ERROR: Another server is running at this address!");
            break;
        default:
            console.log(err);
            break;
    }
});