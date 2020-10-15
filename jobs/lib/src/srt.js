"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputSrt = void 0;
var util_1 = require("./util");
var fs_1 = require("fs");
var lodash_1 = require("lodash");
var subtract = function (leftHmsf, rightHmsf) {
    return util_1.convertSecondsToHMSF(util_1.convertHMSFtoSeconds(leftHmsf) - util_1.convertHMSFtoSeconds(rightHmsf));
};
var getDuration = function (from, to) {
    var fromSec = util_1.convertHMSFtoSeconds(from);
    var toSec = util_1.convertHMSFtoSeconds(to);
    var duration = toSec - fromSec;
    return duration;
};
var createSrtLines = function (scenes, subtitles) {
    var outputLines = [];
    var sceneDuration = 0;
    scenes.forEach(function (scene) {
        var subs = subtitles.filter(function (sub) { return sub.sceneId === scene.id; });
        subs.forEach(function (sub) {
            var start = subtract(sub.from, scene.from);
            var from = util_1.convertSecondsToHMSF(util_1.convertHMSFtoSeconds(start) + sceneDuration);
            var duration = getDuration(sub.from, sub.to);
            var to = util_1.convertSecondsToHMSF(util_1.convertHMSFtoSeconds(from) + duration);
            outputLines.push({
                from: from.replace('.', ','),
                to: to.replace('.', ','),
                text: sub.text,
            });
        });
        sceneDuration += getDuration(scene.from, scene.to);
    });
    return outputLines;
};
var writeSrtLines = function (lines, filePath) {
    return new Promise(function (resolve, reject) {
        var stream = fs_1.createWriteStream(filePath, { encoding: 'utf8' });
        lodash_1.orderBy(lines, 'from').forEach(function (line, index) {
            stream.write(index + 1 + "\n");
            stream.write(line.from + " --> " + line.to + "\n");
            stream.write("<font color=\"#FEFEFE\">" + line.text + "</font>\n\n");
        });
        stream.on('close', resolve);
        stream.on('error', reject);
        stream.close();
    });
};
var outputPath = 'video.srt';
exports.outputSrt = function (scenes, subtitles) { return __awaiter(void 0, void 0, void 0, function () {
    var lines;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lines = createSrtLines(scenes, subtitles);
                return [4 /*yield*/, writeSrtLines(lines, outputPath)];
            case 1:
                _a.sent();
                return [2 /*return*/, outputPath];
        }
    });
}); };
// (async () => {
//   await outputSrt(dummyScenes, dummySubtitles);
// })().catch(console.error);
