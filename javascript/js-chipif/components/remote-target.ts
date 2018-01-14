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
}
/**
 * Class remoteTarget encapsulates the chip interface...
 */

export class remoteTarget {
    protected ipAddress : string;
    protected port : number;
    protected socket : any;
    protected isConnected : boolean;
    protected isDebug : boolean;
    protected identity: string;
    

    constructor(remoteIP : string, port : number = 5000) {
        this.ipAddress      = remoteIP;
        this.port           = port;
        this.isConnected    = false;
        this.isDebug        = false;
        this.socket         = undefined;
        this.identity       = "";
    }
    
    set debug(val : boolean) {
        this.isDebug = val;
    }

    /** Connect to the remote target */
    connect() : Promise<any> {
        let that = this;

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
                resolve()
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
            this.identity       = "";
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
                that.identity = data.toString();
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

    status() : any {
        let obj = {
            ipAddress   : this.ipAddress,
            port        : this.port,
            isConnected : this.isConnected,
            identity    : this.identity.toString()
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
