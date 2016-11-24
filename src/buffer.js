var putBuffer = [];
export function clearBuffer() {
    putBuffer = [];
}
export function appendToBuffer(mp3Buf) {
    if (putBuffer.length > 100) {
        putBuffer.splice(0, 1);
    }
    putBuffer.push(new Int8Array(mp3Buf));
}
export function getPutBuffer(){
    return putBuffer;
}

