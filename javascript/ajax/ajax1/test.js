const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

let req = new XMLHttpRequest();

function reqListener() {
    let json = JSON.parse(this.responseText);
    console.log(json);
}

req.addEventListener('load', reqListener);
req.open("GET", "http://localhost:3000/config/files");
req.send();
