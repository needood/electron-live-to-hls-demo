import {
    clearBuffer, appendToBuffer, getPutBuffer
}
from "./buffer";
import {
    alert
} from "./notification"
import {
    wsUrl
}
from "./config";

var websocket = WebSocket || MozWebSocket;
var client;
var last_recv_ping_time;

/*
function postData(putBuffer) {
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "http://192.168.20.88:5555", true);
    oReq.onload = function(oEvent) {};
    oReq.send(new Blob(putBuffer, {
        type: 'audio/mp3'
    }));
}
*/

export function putIcecast() {
    if (client.readyState == 1) {
        var putBuffer = getPutBuffer();
        if (putBuffer.length >= 5) {
            //postData(putBuffer);
            client.send(new Blob(putBuffer, {
                type: 'audio/mp3'
            }));
            clearBuffer();
        }
    }
}

function time() {
    return Date.parse(new Date()) / 1000;
}


export function finishSocket() {
    appendToBuffer(mp3Encoder.flush());
    putIcecast();
    clearBuffer();
    client.close(1000);
}
export function reconnectSocket() {
    if (client.readyState == 3) {
        // closed
        initSocket();
    } else if (client.readyState == 1) {
        // ping timed out
        if (time() - last_recv_ping_time > 5) {
            initSocket();
        }
    }
}
export function initSocket() {
    if (websocket == undefined) {
        alert('不支持websocket 请使用chrome');
    }
        client = new websocket(wsUrl, 'echo-protocol');
        last_recv_ping_time = time();

        client.onopen = function(event) {
            last_recv_ping_time = time();

            client.onmessage = function(event) {
                console.log('WebSocket onmessage' + event);
                last_recv_ping_time = time();
            };

            client.onclose = function(event) {
                var info = '';
                switch (event.code) {
                    case 1000:
                        info = '';
                        break;
                    case 1005:
                        info = '直播结束！';
                        break;
                    case 1006:
                        info = ' 服务器断开连接, 稍后重试！';
                        reconnectSocket();
                        break;
                    case 4001:
                        info = '网络错误, 正在重试！';
                        break;
                    case 4000:
                        info = '该直播间已被占用，请检查是否打开了多个窗口';
                        break;
                    default:
                        info = '未知错误！';
                }
                alert(info + ' code:' + event.code);
            };
        };
        client.onerror = function(event) {
            alert('链接出错');
            setTimeout(reconnectSocket,1E3);
        };
}


export default client;
