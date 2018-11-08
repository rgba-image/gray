"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const fs = require("fs");
const png_1 = require("@rgba-image/png");
const __1 = require("..");
const patternPng = fs.readFileSync('./src/test/fixtures/pattern.png');
const patternBorderPng = fs.readFileSync('./src/test/fixtures/pattern-border.png');
const grayToImagePng = fs.readFileSync('./src/test/fixtures/gray-to-image.png');
const grayToImageOutOfBoundsPng = fs.readFileSync('./src/test/fixtures/gray-to-image-out-of-bounds.png');
const patternBorderRedChannelPng = fs.readFileSync('./src/test/fixtures/pattern-border-red-channel.png');
const patternBorderGreenChannelPng = fs.readFileSync('./src/test/fixtures/pattern-border-green-channel.png');
const patternBorderBlueChannelPng = fs.readFileSync('./src/test/fixtures/pattern-border-blue-channel.png');
const patternBorderAlphaChannelPng = fs.readFileSync('./src/test/fixtures/pattern-border-alpha-channel.png');
const alphaOutOfBoundsPng = fs.readFileSync('./src/test/fixtures/alpha-out-of-bounds.png');
const maskedPatternPng = fs.readFileSync('./src/test/fixtures/masked-pattern.png');
const maskedPatternRegionPng = fs.readFileSync('./src/test/fixtures/masked-pattern-region.png');
const maskedOutOfBoundsPng = fs.readFileSync('./src/test/fixtures/masked-out-of-bounds.png');
const patternFromAveragePng = fs.readFileSync('./src/test/fixtures/pattern-from-average.png');
const patternFromAverageOutOfBoundsPng = fs.readFileSync('./src/test/fixtures/pattern-from-average-out-of-bounds.png');
const patternFromLightnessPng = fs.readFileSync('./src/test/fixtures/pattern-from-lightness.png');
const patternFromLightnessOutOfBoundsPng = fs.readFileSync('./src/test/fixtures/pattern-from-lightness-out-of-bounds.png');
const pattern = png_1.fromPng(patternPng);
const patternBorder = png_1.fromPng(patternBorderPng);
const expectGrayToImage = png_1.fromPng(grayToImagePng);
const expectGrayToImageOutOfBounds = png_1.fromPng(grayToImageOutOfBoundsPng);
const expectPatternBorderRedChannel = png_1.fromPng(patternBorderRedChannelPng);
const expectPatternBorderGreenChannel = png_1.fromPng(patternBorderGreenChannelPng);
const expectPatternBorderBlueChannel = png_1.fromPng(patternBorderBlueChannelPng);
const expectPatternBorderAlphaChannel = png_1.fromPng(patternBorderAlphaChannelPng);
const expectAlphaOutOfBounds = png_1.fromPng(alphaOutOfBoundsPng);
const expectMaskedPattern = png_1.fromPng(maskedPatternPng);
const expectMaskedPatternRegion = png_1.fromPng(maskedPatternRegionPng);
const expectMaskedOutOfBounds = png_1.fromPng(maskedOutOfBoundsPng);
const expectPatternFromAverage = png_1.fromPng(patternFromAveragePng);
const expectPatternFromAverageOutOfBounds = png_1.fromPng(patternFromAverageOutOfBoundsPng);
const expectPatternFromLightness = png_1.fromPng(patternFromLightnessPng);
const expectPatternFromLightnessOutOfBounds = png_1.fromPng(patternFromLightnessOutOfBoundsPng);
describe('gray', () => {
    describe('createGray', () => {
        it('accepts valid width and height', () => {
            assert.doesNotThrow(() => __1.createGray(5, 10));
        });
        it('black rectangle if no data', () => {
            const { width, height, data } = __1.createGray(5, 10);
            assert.strictEqual(data.length, width * height);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = y * width + x;
                    assert.strictEqual(data[index], 0);
                }
            }
        });
        it('accepts valid width, height and data', () => {
            const width = 5;
            const height = 10;
            const data = new Uint8ClampedArray(width * height);
            assert.doesNotThrow(() => __1.createGray(width, height, data));
        });
        it('bad arguments', () => {
            assert.throws(() => __1.createGray(5, 10, new Uint8ClampedArray(49)));
            assert.throws(() => __1.createGray(5, 10, new Uint8ClampedArray(101)));
        });
    });
    describe('grayToImage', () => {
        it('creates an image from a gray image', () => {
            const width = 8;
            const height = 8;
            const data = new Uint8ClampedArray([
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 127, 127, 128, 128, 0, 0,
                0, 0, 254, 255, 254, 255, 0, 0,
                0, 0, 255, 254, 255, 254, 0, 0,
                0, 0, 128, 128, 127, 127, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0
            ]);
            const gray = __1.createGray(width, height, data);
            const image = __1.grayToImage(gray, 2, 2, 4, 4);
            assert.deepEqual(image, expectGrayToImage);
        });
        it('bad arguments', () => {
            assert.throws(() => __1.grayToImage(__1.createGray(8, 8), 0, 0, 0, 0));
        });
        it('out of bounds', () => {
            const width = 8;
            const height = 8;
            const data = new Uint8ClampedArray([
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 127, 127, 128, 128, 0, 0,
                0, 0, 254, 255, 254, 255, 0, 0,
                0, 0, 255, 254, 255, 254, 0, 0,
                0, 0, 128, 128, 127, 127, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0
            ]);
            const gray = __1.createGray(width, height, data);
            const image = __1.grayToImage(gray, -2, -2, 12, 12);
            assert.deepEqual(image, expectGrayToImageOutOfBounds);
        });
    });
    describe('extractChannel', () => {
        it('extracts red channel', () => {
            let red = __1.extractRed(patternBorder, 2, 2, 8, 8);
            let image = __1.grayToImage(red);
            assert.deepEqual(image, expectPatternBorderRedChannel);
            red = __1.extractRed(pattern);
            image = __1.grayToImage(red);
            assert.deepEqual(image, expectPatternBorderRedChannel);
            red = __1.extractChannel(pattern, __1.RED_CHANNEL);
            image = __1.grayToImage(red);
            assert.deepEqual(image, expectPatternBorderRedChannel);
        });
        it('extracts green channel', () => {
            let green = __1.extractGreen(patternBorder, 2, 2, 8, 8);
            let image = __1.grayToImage(green);
            assert.deepEqual(image, expectPatternBorderGreenChannel);
            green = __1.extractGreen(pattern);
            image = __1.grayToImage(green);
            assert.deepEqual(image, expectPatternBorderGreenChannel);
        });
        it('extracts blue channel', () => {
            let blue = __1.extractBlue(patternBorder, 2, 2, 8, 8);
            let image = __1.grayToImage(blue);
            assert.deepEqual(image, expectPatternBorderBlueChannel);
            blue = __1.extractBlue(pattern);
            image = __1.grayToImage(blue);
            assert.deepEqual(image, expectPatternBorderBlueChannel);
        });
        it('extracts alpha channel', () => {
            let alpha = __1.extractAlpha(patternBorder, 2, 2, 8, 8);
            let image = __1.grayToImage(alpha);
            assert.deepEqual(image, expectPatternBorderAlphaChannel);
            alpha = __1.extractAlpha(pattern);
            image = __1.grayToImage(alpha);
            assert.deepEqual(image, expectPatternBorderAlphaChannel);
        });
        it('extracts channel bad arguments', () => {
            assert.throws(() => __1.extractAlpha(patternBorder, 0, 0, 0, 0));
            assert.throws(() => __1.extractChannel(patternBorder, -1));
            assert.throws(() => __1.extractChannel(patternBorder, 4));
        });
        it('ignores out of bounds', () => {
            const alpha = __1.extractAlpha(patternBorder, -2, -2, 14, 14);
            const image = __1.grayToImage(alpha);
            assert.deepEqual(image, expectAlphaOutOfBounds);
        });
    });
    describe('extractRgba', () => {
        it('extracts all channels', () => {
            const [red, green, blue, alpha] = __1.extractRgba(pattern);
            const redImage = __1.grayToImage(red);
            const greenImage = __1.grayToImage(green);
            const blueImage = __1.grayToImage(blue);
            const alphaImage = __1.grayToImage(alpha);
            assert.deepEqual(redImage, expectPatternBorderRedChannel);
            assert.deepEqual(blueImage, expectPatternBorderBlueChannel);
            assert.deepEqual(greenImage, expectPatternBorderGreenChannel);
            assert.deepEqual(alphaImage, expectPatternBorderAlphaChannel);
        });
        it('extracts all channels from a region', () => {
            const [red, green, blue, alpha] = __1.extractRgba(patternBorder, 2, 2, 8, 8);
            const redImage = __1.grayToImage(red);
            const greenImage = __1.grayToImage(green);
            const blueImage = __1.grayToImage(blue);
            const alphaImage = __1.grayToImage(alpha);
            assert.deepEqual(redImage, expectPatternBorderRedChannel);
            assert.deepEqual(blueImage, expectPatternBorderBlueChannel);
            assert.deepEqual(greenImage, expectPatternBorderGreenChannel);
            assert.deepEqual(alphaImage, expectPatternBorderAlphaChannel);
        });
        it('extracts all channels bad arguments', () => {
            assert.throws(() => __1.extractRgba(patternBorder, 0, 0, 0, 0));
        });
        it('ignores out of bounds', () => {
            const [, , , alpha] = __1.extractRgba(patternBorder, -2, -2, 14, 14);
            const alphaImage = __1.grayToImage(alpha);
            assert.deepEqual(alphaImage, expectAlphaOutOfBounds);
        });
    });
    describe('maskImage', () => {
        it('masks an image', () => {
            const width = 8;
            const height = 8;
            const data = new Uint8ClampedArray([
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255,
                255, 0, 127, 255, 0, 127, 255, 0,
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255,
                255, 0, 127, 255, 0, 127, 255, 0,
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255
            ]);
            const mask = __1.createGray(width, height, data);
            const maskedPattern = png_1.fromPng(patternPng);
            __1.maskImage(mask, maskedPattern);
            assert.deepEqual(maskedPattern, expectMaskedPattern);
        });
        it('masks a region', () => {
            const width = 8;
            const height = 8;
            const data = new Uint8ClampedArray([
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255,
                255, 0, 127, 255, 0, 127, 255, 0,
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255,
                255, 0, 127, 255, 0, 127, 255, 0,
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255
            ]);
            const mask = __1.createGray(width, height, data);
            const maskedPattern = png_1.fromPng(patternBorderPng);
            __1.maskImage(mask, maskedPattern, 1, 1, 6, 6, 3, 3);
            assert.deepEqual(maskedPattern, expectMaskedPatternRegion);
        });
        it('does nothing when size is 0', () => {
            const width = 8;
            const height = 8;
            const data = new Uint8ClampedArray([
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255,
                255, 0, 127, 255, 0, 127, 255, 0,
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255,
                255, 0, 127, 255, 0, 127, 255, 0,
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255
            ]);
            const mask = __1.createGray(width, height, data);
            const maskedPattern = png_1.fromPng(patternPng);
            __1.maskImage(mask, maskedPattern, 0, 0, 0, 0);
            assert.deepEqual(maskedPattern, pattern);
        });
        it('out of bounds', () => {
            const width = 8;
            const height = 8;
            const data = new Uint8ClampedArray([
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255,
                255, 0, 127, 255, 0, 127, 255, 0,
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255,
                255, 0, 127, 255, 0, 127, 255, 0,
                0, 127, 255, 0, 127, 255, 0, 127,
                127, 255, 0, 127, 255, 0, 127, 255
            ]);
            const mask = __1.createGray(width, height, data);
            const maskedPattern = png_1.fromPng(patternPng);
            __1.maskImage(mask, maskedPattern, 0, 0, 10, 10, -2, -2);
            assert.deepEqual(maskedPattern, expectMaskedOutOfBounds);
        });
    });
    describe('fromAverage', () => {
        it('from average pixel values', () => {
            const average = __1.fromAverage(pattern);
            const image = __1.grayToImage(average);
            assert.deepEqual(image, expectPatternFromAverage);
        });
        it('bad arguments', () => {
            assert.throws(() => __1.fromAverage(pattern, 0, 0, 0, 0));
        });
        it('out of bounds', () => {
            const average = __1.fromAverage(patternBorder, -2, -2, 20, 20);
            const image = __1.grayToImage(average);
            assert.deepEqual(image, expectPatternFromAverageOutOfBounds);
        });
    });
    describe('fromLightness', () => {
        it('from lightness values', () => {
            const lightness = __1.fromLightness(pattern);
            const image = __1.grayToImage(lightness);
            assert.deepEqual(image, expectPatternFromLightness);
        });
        it('bad arguments', () => {
            assert.throws(() => __1.fromLightness(pattern, 0, 0, 0, 0));
        });
        it('out of bounds', () => {
            const lightness = __1.fromLightness(patternBorder, -2, -2, 20, 20);
            const image = __1.grayToImage(lightness);
            assert.deepEqual(image, expectPatternFromLightnessOutOfBounds);
        });
    });
    describe('combineChannels', () => {
        it('combines channels', () => {
            const channels = __1.extractRgba(pattern);
            const combined = __1.combineChannels(...channels);
            assert.deepEqual(combined, pattern);
        });
        it('bad arguments', () => {
            const [r, g, b] = __1.extractRgba(pattern);
            assert.throws(() => __1.combineChannels(r, g, b, __1.createGray(4, 4)));
        });
    });
});
//# sourceMappingURL=index.js.map