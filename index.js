const fs = require('fs');
const mic = require('mic');

var index = 1;
var buffer = new Buffer(0);
var micInstance = mic({rate: '16000', channels: '1', encoding: 'signed-integer', device: 'default', exitOnSilence: 5 });

var micInputStream = micInstance.getAudioStream();

micInputStream.on('data', function(data) {
    console.log("Recieved Input Stream: " + data.length);
    var newArray = new Int16Array(data);
    var newBuffer = new Buffer(newArray);
    buffer = Buffer.concat([buffer, newBuffer]);
});

micInputStream.on('error', function(err) {
    cosole.log("Error in Input Stream: " + err);
});

micInputStream.on('startComplete', function() {
    console.log("Got SIGNAL startComplete");
});

micInputStream.on('stopComplete', function() {
    console.log("Got SIGNAL stopComplete");
});

micInputStream.on('pauseComplete', function() {
    console.log("Got SIGNAL pauseComplete");
});

micInputStream.on('resumeComplete', function() {
    console.log("Got SIGNAL resumeComplete");
});

micInputStream.on('silence', function() {
    console.log("Got SIGNAL silence");
    var writerStream = fs.createWriteStream('samples/sample' + index + '.raw');
    writerStream.write(buffer);
    writerStream.end();
    buffer = new Buffer(0);
    index++;
});

micInputStream.on('processExitComplete', function() {
     console.log("Got SIGNAL processExitComplete");
});

micInstance.start();
