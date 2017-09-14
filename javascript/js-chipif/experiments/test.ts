import { clearInterval, setInterval } from 'timers';
/**
 *  @module     main.ts
 *  @author     Michael Uman
 *  @date       August 29, 2017
 */


import { remoteTarget } from "./components/remote-target.js";

let remoteIP : string   = "10.10.10.15"
let port : number       = 5000;
let address : number    = 0x100000;


let testObject = [
    { address: 0x100000, value: 0, label: "register #1" },
    { address: 0x100004, value: 0, label: "register #2" },
    { address: 0x100008, value: 0, label: "register #3" },
    { address: 0x10000c, value: 0, label: "register #4" },
];


let target : any = new remoteTarget(remoteIP, port);

//target.debug = true;

let bCancel = false;

let stdin = process.stdin;

async function getInfo() : Promise<any> {
    return new Promise(async (resolve) => {
        let identity = await target.identify();
        let version  = await target.version();

        resolve( { identity : identity, version: version });
    });
}

function displayValues(values : Array<any>) : void {
    values.forEach( (element : any) => {
        console.log(" Read 0x" + element.address.toString(16) + " (" + 
                     element.label + ") = " + element.value.toString(16));
    });
}

target.connect().then(function () {
    console.log("Connected!");

    getInfo().then((object) => {
        console.log(object);

        target.readValues(testObject).then((valArray: Array<any>) => {
            displayValues(valArray);
            target.disconnect();
        })

    });
}).catch( function (e : string) {
    console.log(e);
});
