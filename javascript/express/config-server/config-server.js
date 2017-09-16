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

/** Get an XML parser */
let   xmlParser     = new xml2js.Parser();

function getConfigInfo(configName) {
    return new Promise((resolve, reject) => {
        let self = this;
        let configObj = {
            "filePath": configName,
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
            }
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
//                    console.log(data.toString());
        });
    });
}

function getConfigFiles() {
    let rdPromise = new Promise((resolve, reject) => {
        fs.readdir(configPath, (err, files) => {
            if (err) {
                console.log(err);
                reject();
            }

            let promiseArray = [];

            files.forEach(function(configFilename) {
                if (configFilename.endsWith(".xml")) {
                    console.log("processing file " + configFilename);
                    promiseArray.push(getConfigInfo( configPath + configFilename));
                }
            }, this);

            Promise.all(promiseArray).then((results) => {
                console.log(results);
                resolve(results);
            });
        });
    });
    return rdPromise;
}


let app = express();
let configFileArray = [];

getConfigFiles().then((files) => {
    console.log(files);
    configFileArray = files;
}).catch((reason) => {
    console.log(reason);
});

app.use('/config', (req, res) => {
    res.send(configFileArray);
});

app.use('/', (req, res) => {
    res.send("OK");
});


let server = app.listen(serverPort);