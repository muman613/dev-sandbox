/**
 *  test err
 */ 

function mySubFunction(name: string) : boolean {
    if (name === 'mike') {
        throw new Error("mike is not accepted!")
    }

    return true;
}

function myFunction(name : string) : string {
    let sRes : string = "";

    if (name === 'jane') {
        throw new Error("Cannot handle jane!");
    }

    if (mySubFunction(name)) {
        sRes = "Mr " + name + " Evil";
    } else {
        sRes = "Sad Sack";
    }

    return sRes;
}

try {
    let fullName : string = myFunction('mike');
} catch (err) {
    console.log("caught exception! " + err);
}
