"use strict";

const Telnet = require('telnet-client');

async function run() {
    let connection = new Telnet();

    let params = {
        host: "10.10.10.15",
        timeout: 1500
    };

    await connection.connect(params);
    let res = (await connection.exec('source /mnt/cvsroot/mrun.env')).trim();
    console.log("async results : ", res);

    res= (await connection.exec('/mnt/cvsroot/bin/which_chip.bash')).trim();

    console.log("async results : ", res);

    connection.destroy();
}

run();
