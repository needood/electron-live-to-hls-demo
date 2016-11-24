const stream = require('stream');
/*
 * 测试
const reader = new stream.Readable();
reader._read = Function();
reader.pipe(process.stdout);
setInterval(function(){
    reader.unshift("test");
},1000);
*/

/*
const spawn = require('child_process').spawn;

const args = ['-i', 'pipe:0', '-c', 'copy', 'test.mp3'];
const c = spawn("ffmpeg",args);
file.pipe(c.stdin);
*/

var FFmpegArgs = "-i pipe:0 -v 40 -rtbufsize 128K -acodec aac -strict experimental -ar 44100 -ac 2 -b:a 192k".split(" ");

function StreamToFFmpeg() {
    this.reader = new stream.Readable();
    this.reader._read = function() {};
    this.ic = 0;
    this.oc = 0;
}
StreamToFFmpeg.prototype.unshift = function(data) {
    //console.log("i", this.ic++);
    this.reader.unshift(data);
};
StreamToFFmpeg.prototype.init = function(dest) {
    const self = this;
    const spawn = require('child_process').spawn;
    const args = FFmpegArgs.concat(dest);
    var c;
    restart();
    function restart(){
        c = spawn("ffmpeg", args, { stdio: ['pipe', 'ignore', 'ignore'] });
        self.reader.pipe(c.stdin);
        c.on('close', (code) => {
            console.log('close by code:'+code);
            if(code!==null){
                restart();
            }
        });
    }


};

module.exports = StreamToFFmpeg;
