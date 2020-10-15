"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHMSFtoSeconds = exports.convertSecondsToHMSF = void 0;
exports.convertSecondsToHMSF = function (seconds) {
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var h = Math.floor(hours).toString().padStart(2, '0');
    var m = Math.floor(minutes % 60)
        .toString()
        .padStart(2, '0');
    var s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');
    var f = seconds.toFixed(3).split('.')[1];
    var result = h + ":" + m + ":" + s + "." + f;
    return result;
};
var regHMSF = /(\d{2}):(\d{2}):(\d{2}).(\d{3})/;
exports.convertHMSFtoSeconds = function (hmsf) {
    var match = regHMSF.exec(hmsf);
    if (!match) {
        throw new Error('hmsf');
    }
    var h = match[1], m = match[2], s = match[3], f = match[4];
    var time = Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(f) / 1000;
    return time;
};
