/**
 * 
 */

const fs        = require('fs');
const readline  = require('readline');
const printf    = require('printf');

interface symbolEntry {
    symbol:     string;
    address:    number;
};

export class ucodeLabels {
    protected symbolArray : Array<symbolEntry>;
    protected isDebug : boolean;
    protected pmBase : number;
    protected filePath: string;

    constructor() {
        this.isDebug        = false;
        this.symbolArray    = [];
        this.pmBase         = 0x100000;
    }

    set debug(val : boolean) {
        this.isDebug = val;
    }

    get size() {
        return this.symbolArray.length;
    }

    get file() {
        return this.filePath;
    }

    set pmbase(base : number) {
        console.log("pmBase set to ", base.toString(16));
        this.pmBase = base;
    }

    get pmbase() {
        return this.pmBase;
    }

    clear() {
        this.symbolArray.length = 0;
        this.filePath = "";
    }

    /** Parse microcode labels file */
    async parseHeader(headerFile : string) : Promise<any> {
        if (this.isDebug)
            console.log("parseHeader(" + headerFile + ")");

        return new Promise((resolve, reject) => {
            let exp = /(\#define)\s+([A-Za-z_0-9]*)\s+(0x[0-9A-Fa-f]+)/;

            this.clear();

            if (fs.existsSync(headerFile)) {
                
                const rl       = readline.createInterface( {
                    input: fs.createReadStream(headerFile)
                } );
    
                rl.on('line', (line : string) => {
                    if (exp.test(line)) {
                        var found = line.match(exp);
                        if (found) {
                            this.symbolArray.push( {
                                symbol:     found[2],
                                address:    parseInt(found[3]) + this.pmBase
                            });
                        }
                    } else {
            // skip non #define line...
                    }
                }).on('close', () => {
                    // sort the array.
                    this.filePath = headerFile;
                    
                    this.symbolArray.sort( (a : symbolEntry,b : symbolEntry) => {
                        if (a.symbol < b.symbol)
                            return -1;
                        if (a.symbol > b.symbol)
                            return 1;
                        return 0;
                    });
                    resolve();
                });
            } else {
                reject("File Not Found");
            }
        });
    }

    dump(outStream : any) : void {
        if (this.size > 0) {
            this.symbolArray.forEach(element => {
                let line = printf("%-60s - 0x%08x\n", element.symbol, element.address);
                outStream.write(line);
            });
        }
    }

    lookup(symbol: string) : number {
        return 0;
    }

    forEach(cb : any) : void {
        this.symbolArray.forEach((value) => {
            //console.log(value);
            cb(value);
        })
    }
}