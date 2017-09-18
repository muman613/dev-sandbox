/**
 *  @module     :   config-server.js
 *  @author     :   Michael Uman
 */

"use strict";

const express       = require('express');
const fs            = require('fs');
const xml2js        = require('xml2js');
const os            = require('os');

/** Some application constants */
const homeDir       = os.homedir();
const configPath    = homeDir + "/.smpProbe/config/";
const serverPort    = 3000;
let   configsLoaded = false;

/** Get an XML parser */
let   xmlParser     = new xml2js.Parser();

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
function getConfigFiles() {
    return new Promise((resolve, reject) => {
        fs.readdir(configPath, (err, files) => {
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
let configFileArray = [];

getConfigFiles().then((files) => {
    console.log(files);
    configFileArray = files;
    configsLoaded   = true;
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
        res.send(configFileArray);
    } else {
        res.send("No configuratons found!");
    }
});

app.use('/', (req, res) => {
    res.send("OK");
});


let server = app.listen(serverPort, function () {
    console.log("HTTP Server waiting on port " + server.address().port);
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