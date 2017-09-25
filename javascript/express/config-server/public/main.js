/**
 *
 */

var socket = undefined;
let messagesDiv = undefined;


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
}

function onSendClick() {
    console.log("onSendClick() called!")

    if (socket) {
        let data = {
            dest: "10.10.10.12",
            packet: "abcdefg"
        };

        socket.emit('send', data);
    } else {
        console.log("Not connected!");
    }
}

window.onload = function() {
    messagesDiv = document.getElementById('messages');

}