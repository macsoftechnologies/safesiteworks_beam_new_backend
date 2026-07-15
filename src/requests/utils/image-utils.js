"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBase64Image = getBase64Image;
var fs = require("fs");
var path = require("path");
/**
 * Reads a local image file and returns its Base64 data URL representation.
 */
function getBase64Image(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return '';
        }
        var fileBuffer = fs.readFileSync(filePath);
        var ext = path.extname(filePath).slice(1).toLowerCase();
        var mime = ext === 'jpg' ? 'jpeg' : ext;
        return "data:image/".concat(mime, ";base64,").concat(fileBuffer.toString('base64'));
    }
    catch (error) {
        console.error("Error encoding image ".concat(filePath, " to Base64:"), error);
        return '';
    }
}
