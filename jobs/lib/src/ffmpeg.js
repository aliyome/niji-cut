"use strict";
// https://creazy.net/2018/03/ffmpeg-no-deterioration-combine-cutout.html
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.burnSubtitle = exports.concatScenes = exports.formatFiles = exports.cutScene = void 0;
var ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
var ffprobeStatic = __importStar(require("ffprobe-static"));
var fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
fluent_ffmpeg_1.default.setFfprobePath(ffprobeStatic.path);
exports.cutScene = function (srcFile, sceneId, from, // HH:mm:ss.fff
duration) {
    return new Promise(function (resolve, reject) {
        var filename = sceneId + ".mp4";
        fluent_ffmpeg_1.default(srcFile)
            .seekInput(from)
            .inputOption("-t " + duration)
            .output(filename)
            .on('end', function () { return resolve(filename); })
            .run();
    });
};
exports.formatFiles = function (filenames) {
    return filenames.map(function (name) { return "file '" + name + "'"; }).join('\n');
};
exports.concatScenes = function (filelistPath) {
    return new Promise(function (resolve, reject) {
        var output = 'concat.mp4';
        fluent_ffmpeg_1.default()
            .input(filelistPath)
            .inputFormat('concat')
            .inputOptions(['-f concat', '-safe 0'])
            .videoCodec('copy')
            .audioCodec('copy')
            .outputOptions(['-map 0:v', '-map 0:a'])
            .output(output)
            .on('end', function () { return resolve(output); })
            .run();
    });
};
exports.burnSubtitle = function (videofile, srtfile, outfile) {
    if (outfile === void 0) { outfile = 'result.mp4'; }
    return new Promise(function (resolve, reject) {
        fluent_ffmpeg_1.default(videofile)
            .videoFilters([
            {
                filter: 'subtitles',
                options: [
                    "./" + srtfile,
                    "fontsdir='./fonts'",
                    "force_style='Fontname=Noto Sans JP Medium'",
                ],
            },
        ])
            .output(outfile)
            .on('end', function () { return resolve(outfile); })
            .run();
    });
};
// exports.outputEncoderInfo = () => {
//   return new Promise((resolve, reject) => {
//     ffmpeg.getAvailableEncoders((err, encoders) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(encoders);
//       }
//     });
//   });
// };
// outputEncoderInfo().then(console.log);
// ffmpeg('video.mp4').output(fs.createWriteStream('out.mp4'), { end: true });
