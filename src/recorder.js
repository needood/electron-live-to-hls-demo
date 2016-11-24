import {putIcecast} from"./websocket";
import {encode} from "./encode";
import {appendToBuffer} from "./buffer";
import {drawSpectrum} from "./spectrum";
import {microphoneVol} from "./config";
var context = new AudioContext();
var analyser = context.createAnalyser();
analyser.fftSize = 256;
var recorder =  {};
recorder.connectSpectrum = function(el){
    drawSpectrum(el,function(){
        //长度为128无符号数组用于保存getByteFrequencyData返回的频域数据
        var array = new Uint8Array(128);
        analyser.getByteFrequencyData(array);
        return array;
    });
};
recorder.init = function() {
    initRecorder(recorderFn);
};
var bgmBuffer, bgmHead = 0,
        bgmVol = 1.5;

function initRecorder(fn) {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({
            audio: true
        }, fn, function(error) {
            var msg;
            switch (error.code || error.name) {
                case 'PERMISSION_DENIED':
                case 'PermissionDeniedError':
                    msg = '用户拒绝访问麦客风';
                    break;
                case 'NOT_SUPPORTED_ERROR':
                case 'NotSupportedError':
                    msg = '浏览器不支持麦客风';
                    break;
                case 'MANDATORY_UNSATISFIED_ERROR':
                case 'MandatoryUnsatisfiedError':
                    msg = '找不到麦客风设备';
                    break;
                default:
                    msg = '无法打开麦克风，异常信息:' + (error.code || error.name);
                    break;
            }
            alert(msg);
        });
    } else {
        alert('当前浏览器不支持录音功能');
    }
}

function recorderFn(stream) {
    var microphone = context.createMediaStreamSource(stream),
        processor = context.createScriptProcessor(2048, 1, 1); //bufferSize大小，输入channel数，输出channel数
    var source = context.createBufferSource();
    source.connect(processor);
    source.start();

    var recording = 0;
    var bgming = 0;
    var echo = 1;
    var addBackground = function() {
        if (bgmBuffer == undefined || recording === 0 || bgming === 0) return 0;
        if (bgmHead > bgmBuffer.length) bgmHead = 0;
        bgmHead++;
        return bgmBuffer[bgmHead] * bgmVol / 5;
    };

    processor.onaudioprocess = function(event) {
        //边录音边转换边播放
        var input = event.inputBuffer.getChannelData(0);
        var output = event.outputBuffer.getChannelData(0);
        var data = [];
        for (var i = 0; i < input.length; i++) {
            var background = addBackground();
            var d = input[i] * microphoneVol + background;
            if(echo===1){
                output[i] = d;
            }else{
                output[i] = 0;
            }
            data.push(d);
        }
        encode(data,function(buf){
            appendToBuffer(buf);
            putIcecast();
        });
    };
    recorder.start = function() {
        if (processor && microphone) {
            microphone.connect(analyser);
            microphone.connect(processor);
            processor.connect(context.destination);
            recording = 1;
        }

    };

    recorder.stop = function() {
        if (processor && microphone) {
            microphone.disconnect();
            processor.disconnect();
            recording = 0;
        }

    };
    recorder.background = function(file) {
        if(Object.prototype.toString.call(file)==="[object ArrayBuffer]"){
            context.decodeAudioData(file, function(buffer) {
                bgmBuffer = buffer.getChannelData(0);
                bgmHead = 0;
                bgming = 1;
            }, function(e) {
                console.log(e);
            });
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            context.decodeAudioData(e.target.result, function(buffer) {
                bgmBuffer = buffer.getChannelData(0);
                bgmHead = 0;
            }, function(e) {
                console.log(e);
            });
        };
        reader.readAsArrayBuffer(file);
        bgming = 1;
    };
    recorder.bgming = function(bool) {
        bgming = bool?1:0;
    };
    recorder.echo = function(bool) {
        echo = bool?1:0;
    };
}




export default recorder;
