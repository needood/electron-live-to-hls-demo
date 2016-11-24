import {microphoneVol} from "./config";
export function drawSpectrum(canvasOne,fn){
    var cnt = 0;
    var ctx = canvasOne.getContext("2d");
    var WIDTH = canvasOne.width;
    var HEIGHT = canvasOne.height;
    _drawSpectrum();
    function _drawSpectrum() {
        cnt++;
        if (cnt % 2 === 0) {
            requestAnimationFrame(_drawSpectrum);
            return;
        }

        var array = fn();
        ctx.fillStyle = "#000";
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for (var i = 0; i <= 20; i++) {
            var value = array[i * 3] * microphoneVol / 2.5;
            ctx.fillRect((20 - i) * 10, HEIGHT / 2 - value / 2, 4, value);
            ctx.fillRect((20 + i) * 10, HEIGHT / 2 - value / 2, 4, value);
        }
        for (var i = 0; i < 40; i++) {
            ctx.fillRect(i * 10, HEIGHT / 2, 4, 2);
        }
        requestAnimationFrame(_drawSpectrum);
    }
}
