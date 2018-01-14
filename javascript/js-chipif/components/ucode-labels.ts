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

    clear() {
        this.symbolArray.length = 0;
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
}