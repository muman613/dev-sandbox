/**
 *  Typescript module to test the avsFrameType class.
 */

import { avsFrameType } from './modules/frametype.js';

let frameType = 2;

function getFrameType(val : number) : string {
    return (new avsFrameType(val).toString());
}

function showFrameType(val : number) : void {
//  console.log("Frame type # " + val + " = " + new avsFrameType(val).toString() + " Frame");
    console.log("Frame type # " + val + " = " + getFrameType(val) + " Frame");
}

// console.log("frameType " + frameType + " = " + new avsFrameType(frameType).toString());

// frameType = 4;

// console.log("frameType " + frameType + " = " + new avsFrameType(frameType).toString());

for ( let x : number = 0 ; x < 6 ; x++) {
    showFrameType( x );
}