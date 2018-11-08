# gray

Work with 1 byte per pixel data

## install

`npm install @rgba-image/gray`

## usage

### createGray

Creates an object similar to an `ImageData`, but the length of the `.data`
property is `width * height` rather than `width * height * 4`

```js
const { createGray } = require( '@rgba-image/gray' )

const width = 5
const height = 10
const gray = createGray( width, height )

const data = new Uint8ClampedArray( width * height )

data.fill( 127 )

const grayFromData = createGray( width, height, data )
```

### extractChannel

Extract a single channel from the RGBA data

```js
const { ALPHA_CHANNEL, extractChannel } = require( '@rgba-image/gray' )

// get some image here

const alpha = extractChannel( image, ALPHA_CHANNEL )

const x = 2
const y = 3
const width = 5
const height = 7

const alphaFromRegion = extractChannel( image, ALPHA_CHANNEL, x, y, width, height )
```

The channels are defined as numbers 0-3:

```js
export const RED_CHANNEL = 0
export const GREEN_CHANNEL = 1
export const BLUE_CHANNEL = 2
export const ALPHA_CHANNEL = 3
```

There are aliases for `extractChannel` where you can omit the channel argument:

- `extractRed`
- `extractGreen`
- `extractBlue`
- `extractAlpha`

You can also get back an array of channels with `extractRgba`:

```js
const { extractRgba } = require( '@rgba-image/gray' )

// get some image here

const [ red, green, blue, alpha ] = extractRgba( image )
```

### maskImage

Mask the destination pixels using a `GrayImage`:

```js
const { maskImage } = require( '@rgba-image/gray' )

// get an image in ImageData format and a mask in `GrayData` format here

maskImage( mask, image )


//mask a region:
const sourceX = 2
const sourceY = 3
const sourceWidth = 5
const sourceHeight = 7
const destX = 4
const destY = 6

maskImage( mask, image, sourceX, sourceY, sourceWith, sourceHeight, destX, destY )
```

### fromAverage

Create a new `GrayData` image from an `ImageData` instance, the gray will be
the average of the red, green and blue channels, ignoring alpha:

```js
const { fromAverage } = require( '@rgba-image/gray' )

// get an image here

const averaged = fromAverage( image )

// from a region:
const x = 2
const y = 3
const width = 5
const height = 7

const averagedFromRegion = fromRegion( image, x, y, width, height )
```

### fromLightness

Convert an image to grayscale.

Creates a new `GrayData` image from an `ImageData` instance, the gray will be
the perceived lightness of the red, green and blue channels, ignoring alpha:

```js
const { fromLightness } = require( '@rgba-image/gray' )

// get an image here

const grayscale = fromLightness( image )

// from a region:
const x = 2
const y = 3
const width = 5
const height = 7

const grayscaleFromRegion = fromLightness( image, x, y, width, height )
```

### grayToImage

Create a normal `ImageData` instance from a `GrayData` instance

```js
const { grayToImage } = require( '@rgba-image/gray' )

// get a gray image here

const image = grayToImage( gray )

// from a region
const x = 2
const y = 3
const width = 5
const height = 7

const imageFromRegion = grayToImage( gray, x, y, width, height )

// alpha is full opacity by default, you can specify it if you want:

const halfAlphaImage = grayToImage( gray, x, y, width, height, 127 )
```

### combineChannels

Combines four `GrayData` instances of the same size to create a new `ImageData`:

```js
const { combineChannels } = require( '@rgba-image/gray' )

// get your gray channels here

const image = combineChannels( red, green, blue, alpha )
```

By default, `grayToImage` and `combineChannels` use
[create-image](https://github.com/rgba-image/create-image)

A factory function is exposed so that you can use a custom `createImage`, such
as [create-image-browser](https://github.com/rgba-image/create-image-browser):

```js
const createImage = require( '@rgba-image/create-image-browser' )
const { GrayToImageFactory } = require( '@rgba-image/gray' )

const { grayToImage, combineChannels } = GrayToImageFactory( createImage )
```

## license

MIT License

Copyright (c) 2018 Nik Coughlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
