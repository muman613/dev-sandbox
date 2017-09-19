let divElement = document.getElementById('output');

console.log("OK");
divElement.innerHTML = "This is a test";

function getJSONData(onJsonLoad) {
    let req = new XMLHttpRequest();


    req.addEventListener('load', onJsonLoad);
    // req.addEventListener('load', () => {
    //     console.log("on load!");
    //     onJsonLoad(JSON.parse(this.responseText));
    // });
    // req.onreadystatechange = function() {
    //     console.log("state change");
    // }

    req.open("GET", "http://localhost:3000/config/files");
    req.send();
}

getJSONData((res) => {
    console.log("loaded");
});