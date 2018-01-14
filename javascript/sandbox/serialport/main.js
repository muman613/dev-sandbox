/**
 * @author Michael A. Uman
 * @date   September 20, 2017 (Happy New Year 5778)
 * 
 * First attempt to enumerate the serial port devices using the 
 */

'use strict';

const serialport = require('serialport');

serialport.list(handleList());
function handleList() {
    return (err, ports) => {
        if (err) {
            console.log(err);
        }
        //  console.log(ports);
        if (ports.length > 0) {
            console.log("Found " + ports.length + " serial ports...");
            ports.forEach((port) => {
                console.log("Port " + port.comName + ": (" +
                    port.manufacturer + ")");
            });
        }
        else {
            console.log('No serial ports found!');
        }
    };
}
