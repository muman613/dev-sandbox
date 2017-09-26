/**
 *
 */

var socket = undefined;
let messagesDiv = undefined;
let remoteEl = undefined;
let gbusEl = undefined;


function onConnectClick() {
    console.log("onConnectClick called!");

    socket = io.connect("http://localhost:3000");

    socket.on("connect", function (data) {
        console.log("connected!");
    });

    socket.on('message', (data) => {
//      alert(data);
        messagesDiv.innerHTML += data + '<br>';
    });

    socket.on('response', function (data) {
        console.log("got response : " + data);
    });

    document.getElementById('sendButton').disabled = false;
}

function onSendClick() {
    console.log("onSendClick() called!")

    if (socket) {
        let remoteIP = remoteEl.value;

        let data = {
            dest: remoteIP,
            packet: "abcdefg"
        };

        socket.emit('send', data);
    } else {
        console.log("Not connected!");
    }
}

window.onload = function() {
    messagesDiv = document.getElementById('messages');
    remoteEl = document.getElementById('remote-ip');
    gbusEl = document.getElementById('gbus-address');
}