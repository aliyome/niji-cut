"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadYoutubeF = exports.register = void 0;
var functions = __importStar(require("firebase-functions"));
var admin = __importStar(require("firebase-admin"));
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var TOKYO = 'asia-northeast1';
admin.initializeApp();
exports.register = functions
    .region(TOKYO)
    .https.onCall(function (_a, context) {
    var videoId = _a.videoId, scenes = _a.scenes, subtitles = _a.subtitles;
    return __awaiter(void 0, void 0, void 0, function () {
        var id;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = admin.firestore().collection('cutScenes').doc().id;
                    return [4 /*yield*/, admin.firestore().doc("cutScenes/" + id).set({
                            id: id,
                            videoId: videoId,
                            scenes: scenes,
                            subtitles: subtitles,
                            createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        })];
                case 1:
                    _b.sent();
                    return [2 /*return*/, id];
            }
        });
    });
});
var isMp4 = function (format) { return format.container === 'mp4'; };
var downloadYoutubeIntoStorage = function (videoId, sceneId, range) {
    console.log('start');
    var bucket = admin.storage().bucket();
    console.log('get default bucket');
    var writeStream = bucket
        .file(videoId + "_" + sceneId + ".mp4")
        .createWriteStream();
    console.log('make write stream');
    ytdl_core_1.default(videoId, {
        quality: 'highest',
        filter: isMp4,
        range: range,
    })
        .pipe(writeStream)
        .on('close', function () { return console.log('end'); });
    console.log('end write setting');
};
// export const downloadYoutube = functions
//   .runWith({ memory: '1GB', timeoutSeconds: 540 })
//   .region(TOKYO)
//   .firestore.document('cutScenes')
//   .onCreate(async (snapshot, context) => {
//     const { videoId } = snapshot.data();
//     downloadYoutubeIntoStorage(videoId);
//   });
exports.downloadYoutubeF = functions
    .runWith({ memory: '1GB', timeoutSeconds: 540 })
    .region(TOKYO)
    .https.onRequest(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var videoId, sceneId, range;
    return __generator(this, function (_a) {
        videoId = 'H5aQwFhjYzI';
        sceneId = 'sceneHoge';
        range = { start: 10000, end: 20000 };
        downloadYoutubeIntoStorage(videoId, sceneId, range);
        return [2 /*return*/];
    });
}); });
