"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@rgba-image/common");
const create_image_1 = require("@rgba-image/create-image");
const create = create_image_1.CreateImageFactory([0], 1);
exports.createGray = (width, height, data) => create(width, height, data);
exports.RED_CHANNEL = 0;
exports.GREEN_CHANNEL = 1;
exports.BLUE_CHANNEL = 2;
exports.ALPHA_CHANNEL = 3;
exports.extractChannel = (source, channel, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy) => {
    channel = (channel | 0);
    sx = sx | 0;
    sy = sy | 0;
    sw = sw | 0;
    sh = sh | 0;
    if (sw <= 0 || sh <= 0)
        throw Error('Cannot create an image with 0 width or height');
    if (channel < 0 || channel > 3)
        throw Error('channel must be 0-3');
    const dest = exports.createGray(sw, sh);
    for (let y = 0; y < sh; y++) {
        const sourceY = sy + y;
        if (sourceY < 0 || sourceY >= source.height)
            continue;
        for (let x = 0; x < sw; x++) {
            const sourceX = sx + x;
            if (sourceX < 0 || sourceX >= source.width)
                continue;
            const sourceIndex = (sourceY * source.width + sourceX) * 4 + channel;
            const destIndex = y * dest.width + x;
            dest.data[destIndex] = source.data[sourceIndex];
        }
    }
    return dest;
};
exports.extractRed = (source, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy) => exports.extractChannel(source, exports.RED_CHANNEL, sx, sy, sw, sh);
exports.extractGreen = (source, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy) => exports.extractChannel(source, exports.GREEN_CHANNEL, sx, sy, sw, sh);
exports.extractBlue = (source, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy) => exports.extractChannel(source, exports.BLUE_CHANNEL, sx, sy, sw, sh);
exports.extractAlpha = (source, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy) => exports.extractChannel(source, exports.ALPHA_CHANNEL, sx, sy, sw, sh);
exports.extractRgba = (source, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy) => {
    sx = sx | 0;
    sy = sy | 0;
    sw = sw | 0;
    sh = sh | 0;
    if (sw <= 0 || sh <= 0)
        throw Error('Cannot create an image with 0 width or height');
    const r = exports.createGray(sw, sh);
    const g = exports.createGray(sw, sh);
    const b = exports.createGray(sw, sh);
    const a = exports.createGray(sw, sh);
    for (let y = 0; y < sh; y++) {
        const sourceY = sy + y;
        if (sourceY < 0 || sourceY >= source.height)
            continue;
        for (let x = 0; x < sw; x++) {
            const sourceX = sx + x;
            if (sourceX < 0 || sourceX >= source.width)
                continue;
            const destIndex = y * sw + x;
            const sourceIndex = (sourceY * source.width + sourceX) * 4;
            r.data[destIndex] = source.data[sourceIndex];
            g.data[destIndex] = source.data[sourceIndex + 1];
            b.data[destIndex] = source.data[sourceIndex + 2];
            a.data[destIndex] = source.data[sourceIndex + 3];
        }
    }
    return [r, g, b, a];
};
exports.maskImage = (source, dest, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy, dx = 0, dy = 0) => {
    sx = sx | 0;
    sy = sy | 0;
    sw = sw | 0;
    sh = sh | 0;
    dx = dx | 0;
    dy = dy | 0;
    if (sw <= 0 || sh <= 0)
        return;
    for (let y = 0; y < sh; y++) {
        const sourceY = sy + y;
        if (sourceY < 0 || sourceY >= source.height)
            continue;
        const destY = dy + y;
        if (destY < 0 || destY >= dest.height)
            continue;
        for (let x = 0; x < sw; x++) {
            const sourceX = sx + x;
            if (sourceX < 0 || sourceX >= source.width)
                continue;
            const destX = dx + x;
            if (destX < 0 || destX >= dest.width)
                continue;
            const sourceIndex = sourceY * source.width + sourceX;
            const destIndex = (destY * dest.width + destX) * 4 + 3;
            dest.data[destIndex] *= (source.data[sourceIndex] / 255);
        }
    }
};
exports.fromAverage = (source, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy) => {
    sx = sx | 0;
    sy = sy | 0;
    sw = sw | 0;
    sh = sh | 0;
    if (sw <= 0 || sh <= 0)
        throw Error('Cannot create an image with 0 width or height');
    const dest = exports.createGray(sw, sh);
    for (let y = 0; y < sh; y++) {
        const sourceY = sy + y;
        if (sourceY < 0 || sourceY >= source.height)
            continue;
        for (let x = 0; x < sw; x++) {
            const sourceX = sx + x;
            if (sourceX < 0 || sourceX >= source.width)
                continue;
            const sourceIndex = (sourceY * source.width + sourceX) * 4;
            const destIndex = y * dest.width + x;
            const r = source.data[sourceIndex];
            const g = source.data[sourceIndex + 1];
            const b = source.data[sourceIndex + 2];
            dest.data[destIndex] = (r + g + b) / 3;
        }
    }
    return dest;
};
exports.fromLightness = (source, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy) => {
    sx = sx | 0;
    sy = sy | 0;
    sw = sw | 0;
    sh = sh | 0;
    if (sw <= 0 || sh <= 0)
        throw Error('Cannot create an image with 0 width or height');
    const dest = exports.createGray(sw, sh);
    for (let y = 0; y < sh; y++) {
        const sourceY = sy + y;
        if (sourceY < 0 || sourceY >= source.height)
            continue;
        for (let x = 0; x < sw; x++) {
            const sourceX = sx + x;
            if (sourceX < 0 || sourceX >= source.width)
                continue;
            const sourceIndex = (sourceY * source.width + sourceX) * 4;
            const destIndex = y * dest.width + x;
            const r = source.data[sourceIndex];
            const g = source.data[sourceIndex + 1];
            const b = source.data[sourceIndex + 2];
            dest.data[destIndex] = r * 0.2126 + g * 0.7152 + b * 0.0722;
        }
    }
    return dest;
};
exports.GrayToImageFactory = (createImage) => {
    const grayToImage = (source, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy, alpha = 255) => {
        sx = sx | 0;
        sy = sy | 0;
        sw = sw | 0;
        sh = sh | 0;
        alpha = alpha | 0;
        if (sw <= 0 || sh <= 0)
            throw Error('Cannot create an image with 0 width or height');
        const dest = createImage(sw, sh);
        const destData = new Uint32Array(dest.data.buffer);
        for (let y = 0; y < sh; y++) {
            const sourceY = sy + y;
            if (sourceY < 0 || sourceY >= source.height)
                continue;
            for (let x = 0; x < sw; x++) {
                const sourceX = sx + x;
                if (sourceX < 0 || sourceX >= source.width)
                    continue;
                const sourceIndex = sourceY * source.width + sourceX;
                const destIndex = y * dest.width + x;
                const gray = source.data[sourceIndex];
                const c = common_1.rgbaToUint32(gray, gray, gray, alpha, common_1.isLittleEndian);
                destData[destIndex] = c;
            }
        }
        return dest;
    };
    const combineChannels = (red, green, blue, alpha) => {
        const { width, height } = red;
        if (green.width !== width || green.height !== height ||
            blue.width !== width || blue.height !== height ||
            alpha.width !== width || alpha.height !== height)
            throw Error('All source channels must be the same size');
        const dest = createImage(width, height);
        const destData = new Uint32Array(dest.data.buffer);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * dest.width + x;
                const r = red.data[index];
                const g = green.data[index];
                const b = blue.data[index];
                const a = alpha.data[index];
                const c = common_1.rgbaToUint32(r, g, b, a, common_1.isLittleEndian);
                destData[index] = c;
            }
        }
        return dest;
    };
    return { grayToImage, combineChannels };
};
_a = exports.GrayToImageFactory(create_image_1.createImage), exports.grayToImage = _a.grayToImage, exports.combineChannels = _a.combineChannels;
//# sourceMappingURL=index.js.map