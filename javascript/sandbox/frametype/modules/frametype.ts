/**
 *  Simple class used to display the AVS2 Frame type mnemonic...
 */

// Picture types
// #define INTRA_IMG                    0  //!< I frame
// #define INTER_IMG                    1  //!< P frame
// #define B_IMG                        2  //!< B frame
// #define I_IMG                        0  //!< I frame
// #define P_IMG                        1  //!< P frame
// #define F_IMG                        4  //!< F frame
// #define BACKGROUND_IMG               3
// #define BP_IMG                       5

/** Class displays AVS2 Frame type  */
export class avsFrameType {
    private _type : number;
    private _typeTable : any = {
        "0": "I",
        "1": "P",
        "2": "B",
        "3": "Background",
        "4": "F",
        "5": "BP"
    }

    constructor(type : number) {
        this._type = type;
    }

	public get type(): number {
		return this._type;
	}

	public set type(value: number) {
		this._type = value;
	}

    /**
     * toString
     */
    public toString() : string {
        let typeString = '';

        if (this._typeTable[this._type]) {
            typeString = this._typeTable[this._type];
//          console.log("found type " + typeString);
        }

        return typeString;
    }
}
