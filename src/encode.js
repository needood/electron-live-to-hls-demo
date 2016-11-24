var mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 64);
var maxSamples = 1152;

function floatTo16BitPCM(input, output) {
    for (var i = 0; i < input.length; i++) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF);
    }
}

function convertBuffer(arrayBuffer) {
    var data = new Float32Array(arrayBuffer);
    var out = new Int16Array(arrayBuffer.length);
    floatTo16BitPCM(data, out);
    return out;
}

export function encode(arrayBuffer,fn) {
    var samplesMono = convertBuffer(arrayBuffer);
    var remaining = samplesMono.length;
    for (var i = 0; remaining >= 0; i += maxSamples) {
        var mono = samplesMono.subarray(i, i + maxSamples);
        var mp3buf = mp3Encoder.encodeBuffer(mono);
        fn(mp3buf);
        remaining -= maxSamples;
    }
}

