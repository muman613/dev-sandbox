/**
 *  @module     main.ts
 *  @author     Michael Uman
 *  @date       August 29, 2017
 */


import { remoteTarget } from "./components/remote-target.js";

const commander = require('commander');

commander
    .version('1.0.0')
    .option('-r, --remote <ip>',    'Remote IP Address')
    .option('-p, --port <n>',       'Remote Port', parseInt)
    .option('-a, --addr <address>', 'GBus address to read')
    .parse(process.argv);

let remoteIP : string   = commander.remote;
let port : number       = commander.port;
let address : number    = parseInt(commander.addr);


let target : any = new remoteTarget(remoteIP, port);

let readArray = [];

for (let x : number = 0 ; x < 10 ; x++) {
    readArray.push( 0x100000 + (x * 8));
}


target.connect().then(function () {
    console.log("Connected!");

    target.identify().then( (ident : Buffer) => {
        let status = target.status();

        target.version().then( (version : string) => {
            console.log("Chip interface %s", version);

            target.gbus_read_uint32(address).then(function (value : number) {
                console.log("Value = %s", value.toString(16));
                target.disconnect();
            });

        });
//        console.log(util.inspect(status, 2));

    });
}).catch( function (e : string) {
    console.log(e);
});
