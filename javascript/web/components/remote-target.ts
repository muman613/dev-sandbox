/**
 *  @module     main.ts
 *  @author     Michael Uman
 *  @date       August 29, 2017
 */

const net = require('net');
//const util = require('util');

interface readValObject {
    address: number;
    value: number;
    label: string;
};

interface targetStatus {
    ipAddress   : string;
    port        : number;
    isConnected : boolean;
    chipId      : string;
    chipVersion : string;
};

/**
 * Class remoteTarget encapsulates the chip interface...
 */

export class remoteTarget {
    protected ipAddress : string;
    protected port : number;
    protected socket : any;
    protected isConnected : boolean;
    protected isDebug : boolean;
    protected chipId: string;
    protected chipVer: string;

    constructor() {
        this.isConnected    = false;
        this.isDebug        = false;
        this.socket         = undefined;
        this.chipId         = "";
        this.chipVer        = "";
    }

    set debug(val : boolean) {
        this.isDebug = val;
    }

    get debug() {
        return this.isDebug;
    }

    get connected() {
        return this.isConnected;
    }

    /** Connect to the remote target */
    connect(remoteIP : string, port : number = 5000) : Promise<any> {
        let that = this;
        
        this.ipAddress = remoteIP;
        this.port      = port;

        return new Promise((resolve : any, reject : any) => {
            that.socket = net.connect( { 
                host: that.ipAddress, 
                port: that.port
            });
    
            that.socket.on('error', function(err : any) {
                if (that.isDebug)
                    console.log("error!");
                that.socket.removeAllListeners();
                reject("error");
            });
            that.socket.on('timeout', function() {
                if (that.isDebug)
                    console.log("timeout!");
                that.socket.removeAllListeners();
                reject("timeout");
            });
            /** Handle connection */
            that.socket.on('connect', function() {
                if (that.isDebug)
                    console.log("connect!");
                that.isConnected = true;
                that.socket.removeAllListeners();
                that.identify().then((id : string) => {
                    console.log("Identity = ", id);
                    that.version().then((v : string) => {
                        console.log("version  = ", v);
                        resolve();
                    }).catch((e : any) => {
                        reject('no-version');
                    });
                }).catch((e : any) => {
                    reject("no-ident");
                });
            });
        });
    }

    /** Disconnect from remote target. */
    disconnect() : void {
        if (this.isDebug)
            console.log("disconnect()");

        if (this.isConnected == true) {
            if (this.isDebug)
                console.log("-- disconnected!");
            this.socket.destroy();
            this.socket         = null;
            this.isConnected    = false;
            this.chipId         = "";
            this.chipVer        = "";
        }
    }

    identify() : Promise<string> {
        if (this.isDebug)
            console.log("identify()");

        let that = this;

        return new Promise((resolve, reject) => {
            let buffer = new Buffer( [ 0x00, 0x00, 0x00, 0x00, 
                0x00, 0x00, 0x20, 0x00,  
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00 ] );
    
            that.socket.on('data', function (data : Buffer) {
                that.chipId = data.toString();
                that.socket.removeAllListeners();
                resolve(data.toString());
            })
            that.socket.on('error', (err : Error) => {
                that.socket.removeAllListeners();
                reject(err);
            })
            that.socket.on('timeout', () => {
                that.socket.removeAllListeners();
                reject();
            })
    
            that.socket.write(buffer);
        });
    }

    /** Get the connection status */
    status() : targetStatus {
        let obj = {
            ipAddress   : this.ipAddress,
            port        : this.port,
            isConnected : this.isConnected,
            chipId      : this.chipId.toString(),
            chipVersion : this.chipVer.toString()
        };

        return obj;
    }

    gbus_read_uint32(addr : number) : Promise<number> {
        let that = this;
        return new Promise((resolve : any, reject : any) => {
            let buffer = new Buffer( [ 0x00, 0x00, 0x00, 0x00, 
                0x00, 0x00, 0x00, 0x08,  
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x04 ] );
    
            buffer.writeUInt32BE(addr, 8);
    
            that.socket.on('data', function (data : Buffer) {
                let value = data.readUInt32BE(0);
                that.socket.removeAllListeners();
                resolve(value);
            })
            that.socket.on('error', (err : any) => {
                that.socket.removeAllListeners();
                reject(err);
            })
            that.socket.on('timeout', () => {
                that.socket.removeAllListeners();
                reject();
            })
    
            that.socket.write(buffer);
        });
    }

    /** Write to address
     * 
     * @param addr      Address to write.
     * @param value     Value to write.
     */
    gbus_write_uint32(addr : number, value: number) : Promise<any> {
        let that = this;
        return new Promise((resolve : any, reject : any) => {
            let buffer = new Buffer( [ 0x00, 0x00, 0x00, 0x00, 
                0x00, 0x00, 0x00, 0x80,  
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x04,
                0x00, 0x00, 0x00, 0x00 ] );
    
            buffer.writeUInt32BE(addr, 8);
            buffer.writeUInt32BE(value, 16);

            that.socket.on('error', (err : any) => {
                that.socket.removeAllListeners();
                reject(err);
            })

            that.socket.write(buffer);
            resolve();
        });
    }
    
    /**
     * Get Chip version #.
     */
    
    version() : Promise<string> {
        let that = this;
        return new Promise((resolve, reject) => {
            let buffer = new Buffer( [ 0x00, 0x00, 0x00, 0x00, 
                0x00, 0x00, 0x20, 0x01,  
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00 ] );

            that.socket.on('data', function (data : Buffer) {
                let value : string = data.toString('ascii').replace(/\0/g, '');
                that.socket.removeAllListeners();
                that.chipVer = value;
                resolve(value);
            });
            that.socket.on('error', (err : any) => {
                that.socket.removeAllListeners();
                reject(err);
            });
            that.socket.on('timeout', () => {
                that.socket.removeAllListeners();
                reject();
            });

            that.socket.write(buffer);
        });
    }

    /**
     * Read all values in the input array.
     * 
     * @param valArray Array of addresses to read.
     */
    // async readValues(valArray : Array<number>) : Promise<any> {
    //     return new Promise(async (resolve) => {
    //         let values : Array<number> = [];
    
    //         for (let x = 0 ; x < valArray.length ; x++) {
    //             let value = await this.gbus_read_uint32(valArray[x]);
    //             if (this.isDebug)
    //                 console.log("Read " + valArray[x].toString(16) + " = " + value.toString());
    //             values.push(value);
    //         }
    
    //         resolve(values);
    //     });
    // }

    async readValues(valArray : Array<readValObject>) : Promise<any> {
        return new Promise(async (resolve) => {
//          let values : Array<number> = [];
    
            for (let x = 0 ; x < valArray.length ; x++) {
                let value = await this.gbus_read_uint32(valArray[x].address);
                valArray[x].value = value;
                if (this.isDebug)
                    console.log("Read " + valArray[x].address.toString(16) + " = " + value.toString());
//                values.push(value);
            }
    
            resolve(valArray);
        });
    }
}
