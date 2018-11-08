import * as assert from 'assert'
import * as fs from 'fs'
import { fromPng, toPng } from '@rgba-image/png'
import {
  createGray, extractChannel, extractAlpha, extractRgba, grayToImage,
  RED_CHANNEL, extractRed, extractGreen, extractBlue, maskImage, fromAverage, fromLightness, combineChannels
} from '..'

const patternPng = fs.readFileSync( './src/test/fixtures/pattern.png' )
const patternBorderPng = fs.readFileSync( './src/test/fixtures/pattern-border.png' )
const grayToImagePng = fs.readFileSync( './src/test/fixtures/gray-to-image.png' )
const grayToImageOutOfBoundsPng = fs.readFileSync( './src/test/fixtures/gray-to-image-out-of-bounds.png' )
const patternBorderRedChannelPng = fs.readFileSync( './src/test/fixtures/pattern-border-red-channel.png' )
const patternBorderGreenChannelPng = fs.readFileSync( './src/test/fixtures/pattern-border-green-channel.png' )
const patternBorderBlueChannelPng = fs.readFileSync( './src/test/fixtures/pattern-border-blue-channel.png' )
const patternBorderAlphaChannelPng = fs.readFileSync( './src/test/fixtures/pattern-border-alpha-channel.png' )
const alphaOutOfBoundsPng = fs.readFileSync( './src/test/fixtures/alpha-out-of-bounds.png' )
const maskedPatternPng = fs.readFileSync( './src/test/fixtures/masked-pattern.png' )
const maskedPatternRegionPng = fs.readFileSync( './src/test/fixtures/masked-pattern-region.png' )
const maskedOutOfBoundsPng = fs.readFileSync( './src/test/fixtures/masked-out-of-bounds.png' )
const patternFromAveragePng = fs.readFileSync( './src/test/fixtures/pattern-from-average.png' )
const patternFromAverageOutOfBoundsPng = fs.readFileSync( './src/test/fixtures/pattern-from-average-out-of-bounds.png' )
const patternFromLightnessPng = fs.readFileSync( './src/test/fixtures/pattern-from-lightness.png' )
const patternFromLightnessOutOfBoundsPng = fs.readFileSync( './src/test/fixtures/pattern-from-lightness-out-of-bounds.png' )

const pattern = fromPng( patternPng )
const patternBorder = fromPng( patternBorderPng )
const expectGrayToImage = fromPng( grayToImagePng )
const expectGrayToImageOutOfBounds = fromPng( grayToImageOutOfBoundsPng )
const expectPatternBorderRedChannel = fromPng( patternBorderRedChannelPng )
const expectPatternBorderGreenChannel = fromPng( patternBorderGreenChannelPng )
const expectPatternBorderBlueChannel = fromPng( patternBorderBlueChannelPng )
const expectPatternBorderAlphaChannel = fromPng( patternBorderAlphaChannelPng )
const expectAlphaOutOfBounds = fromPng( alphaOutOfBoundsPng )
const expectMaskedPattern = fromPng( maskedPatternPng )
const expectMaskedPatternRegion = fromPng( maskedPatternRegionPng )
const expectMaskedOutOfBounds = fromPng( maskedOutOfBoundsPng )
const expectPatternFromAverage = fromPng( patternFromAveragePng )
const expectPatternFromAverageOutOfBounds = fromPng( patternFromAverageOutOfBoundsPng )
const expectPatternFromLightness = fromPng( patternFromLightnessPng )
const expectPatternFromLightnessOutOfBounds = fromPng( patternFromLightnessOutOfBoundsPng )

describe( 'gray', () => {
  describe( 'createGray', () => {
    it( 'accepts valid width and height', () => {
      assert.doesNotThrow( () => createGray( 5, 10 ) )
    } )

    it( 'black rectangle if no data', () => {
      const { width, height, data } = createGray( 5, 10 )

      assert.strictEqual( data.length, width * height )

      for ( let y = 0; y < height; y++ ) {
        for ( let x = 0; x < width; x++ ) {
          const index = y * width + x

          assert.strictEqual( data[ index ], 0 )
        }
      }
    } )

    it( 'accepts valid width, height and data', () => {
      const width = 5
      const height = 10
      const data = new Uint8ClampedArray( width * height )

      assert.doesNotThrow( () => createGray( width, height, data ) )
    } )

    it( 'bad arguments', () => {
      assert.throws( () => ( <any>createGray )( 5, 10, new Uint8ClampedArray( 49 ) ) )
      assert.throws( () => ( <any>createGray )( 5, 10, new Uint8ClampedArray( 101 ) ) )
    } )
  })

  describe( 'grayToImage', () => {
    it( 'creates an image from a gray image', () => {
      const width = 8
      const height = 8
      const data = new Uint8ClampedArray([
          0,   0,   0,   0,   0,   0,   0,   0,
          0,   0,   0,   0,   0,   0,   0,   0,
          0,   0, 127, 127, 128, 128,   0,   0,
          0,   0, 254, 255, 254, 255,   0,   0,
          0,   0, 255, 254, 255, 254,   0,   0,
          0,   0, 128, 128, 127, 127,   0,   0,
          0,   0,   0,   0,   0,   0,   0,   0,
          0,   0,   0,   0,   0,   0,   0,   0
      ])

      const gray = createGray( width, height, data )
      const image = grayToImage( gray, 2, 2, 4, 4 )

      assert.deepEqual( image, expectGrayToImage )
    })

    it( 'bad arguments', () => {
      assert.throws( () => grayToImage( createGray( 8, 8 ), 0, 0, 0, 0 ) )
    })

    it( 'out of bounds', () => {
      const width = 8
      const height = 8
      const data = new Uint8ClampedArray( [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 127, 127, 128, 128, 0, 0,
        0, 0, 254, 255, 254, 255, 0, 0,
        0, 0, 255, 254, 255, 254, 0, 0,
        0, 0, 128, 128, 127, 127, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0
      ] )

      const gray = createGray( width, height, data )
      const image = grayToImage( gray, -2, -2, 12, 12 )

      assert.deepEqual( image, expectGrayToImageOutOfBounds )
    })
  })

  describe( 'extractChannel', () => {
    it( 'extracts red channel', () => {
      let red = extractRed( patternBorder, 2, 2, 8, 8 )
      let image = grayToImage( red )

      assert.deepEqual( image, expectPatternBorderRedChannel )

      red = extractRed( pattern )
      image = grayToImage( red )

      assert.deepEqual( image, expectPatternBorderRedChannel )

      red = extractChannel( pattern, RED_CHANNEL )
      image = grayToImage( red )

      assert.deepEqual( image, expectPatternBorderRedChannel )
    } )

    it( 'extracts green channel', () => {
      let green = extractGreen( patternBorder, 2, 2, 8, 8 )
      let image = grayToImage( green )

      assert.deepEqual( image, expectPatternBorderGreenChannel )

      green = extractGreen( pattern )
      image = grayToImage( green )

      assert.deepEqual( image, expectPatternBorderGreenChannel )
    } )

    it( 'extracts blue channel', () => {
      let blue = extractBlue( patternBorder, 2, 2, 8, 8 )
      let image = grayToImage( blue )

      assert.deepEqual( image, expectPatternBorderBlueChannel )

      blue = extractBlue( pattern )
      image = grayToImage( blue )

      assert.deepEqual( image, expectPatternBorderBlueChannel )
    } )

    it( 'extracts alpha channel', () => {
      let alpha = extractAlpha( patternBorder, 2, 2, 8, 8 )
      let image = grayToImage( alpha )

      assert.deepEqual( image, expectPatternBorderAlphaChannel )

      alpha = extractAlpha( pattern )
      image = grayToImage( alpha )

      assert.deepEqual( image, expectPatternBorderAlphaChannel )
    } )

    it( 'extracts channel bad arguments', () => {
      assert.throws( () => extractAlpha( patternBorder, 0, 0, 0, 0 ) )
      assert.throws( () => extractChannel( patternBorder, <any>-1 ) )
      assert.throws( () => extractChannel( patternBorder, <any>4 ) )
    })

    it( 'ignores out of bounds', () => {
      const alpha = extractAlpha( patternBorder, -2, -2, 14, 14 )
      const image = grayToImage( alpha )

      assert.deepEqual( image, expectAlphaOutOfBounds )
    })
  })

  describe( 'extractRgba', () => {
    it( 'extracts all channels', () => {
      const [ red, green, blue, alpha ] = extractRgba( pattern )
      const redImage = grayToImage( red )
      const greenImage = grayToImage( green )
      const blueImage = grayToImage( blue )
      const alphaImage = grayToImage( alpha )

      assert.deepEqual( redImage, expectPatternBorderRedChannel )
      assert.deepEqual( blueImage, expectPatternBorderBlueChannel )
      assert.deepEqual( greenImage, expectPatternBorderGreenChannel )
      assert.deepEqual( alphaImage, expectPatternBorderAlphaChannel )
    } )

    it( 'extracts all channels from a region', () => {
      const [ red, green, blue, alpha ] = extractRgba( patternBorder, 2, 2, 8, 8 )
      const redImage = grayToImage( red )
      const greenImage = grayToImage( green )
      const blueImage = grayToImage( blue )
      const alphaImage = grayToImage( alpha )

      assert.deepEqual( redImage, expectPatternBorderRedChannel )
      assert.deepEqual( blueImage, expectPatternBorderBlueChannel )
      assert.deepEqual( greenImage, expectPatternBorderGreenChannel )
      assert.deepEqual( alphaImage, expectPatternBorderAlphaChannel )
    } )

    it( 'extracts all channels bad arguments', () => {
      assert.throws( () => extractRgba( patternBorder, 0, 0, 0, 0 ) )
    } )

    it( 'ignores out of bounds', () => {
      const [ ,,, alpha ] = extractRgba( patternBorder, -2, -2, 14, 14 )
      const alphaImage = grayToImage( alpha )

      assert.deepEqual( alphaImage, expectAlphaOutOfBounds )
    } )
  })

  describe( 'maskImage', () => {
    it( 'masks an image', () => {
      const width = 8
      const height = 8
      const data = new Uint8ClampedArray( [
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255,
        255, 0, 127, 255, 0, 127, 255, 0,
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255,
        255, 0, 127, 255, 0, 127, 255, 0,
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255
      ] )

      const mask = createGray( width, height, data )
      const maskedPattern = fromPng( patternPng )

      maskImage( mask, maskedPattern )

      assert.deepEqual( maskedPattern, expectMaskedPattern )
    })

    it( 'masks a region', () => {
      const width = 8
      const height = 8
      const data = new Uint8ClampedArray( [
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255,
        255, 0, 127, 255, 0, 127, 255, 0,
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255,
        255, 0, 127, 255, 0, 127, 255, 0,
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255
      ] )

      const mask = createGray( width, height, data )
      const maskedPattern = fromPng( patternBorderPng )

      maskImage( mask, maskedPattern, 1, 1, 6, 6, 3, 3 )

      assert.deepEqual( maskedPattern, expectMaskedPatternRegion )
    } )

    it( 'does nothing when size is 0', () => {
      const width = 8
      const height = 8
      const data = new Uint8ClampedArray( [
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255,
        255, 0, 127, 255, 0, 127, 255, 0,
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255,
        255, 0, 127, 255, 0, 127, 255, 0,
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255
      ] )

      const mask = createGray( width, height, data )
      const maskedPattern = fromPng( patternPng )

      maskImage( mask, maskedPattern, 0, 0, 0, 0 )

      assert.deepEqual( maskedPattern, pattern )
    })

    it( 'out of bounds', () => {
      const width = 8
      const height = 8
      const data = new Uint8ClampedArray( [
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255,
        255, 0, 127, 255, 0, 127, 255, 0,
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255,
        255, 0, 127, 255, 0, 127, 255, 0,
        0, 127, 255, 0, 127, 255, 0, 127,
        127, 255, 0, 127, 255, 0, 127, 255
      ] )

      const mask = createGray( width, height, data )
      const maskedPattern = fromPng( patternPng )

      maskImage( mask, maskedPattern, 0, 0, 10, 10, -2, -2 )

      assert.deepEqual( maskedPattern, expectMaskedOutOfBounds )
    } )
  })

  describe( 'fromAverage', () => {
    it( 'from average pixel values', () => {
      const average = fromAverage( pattern )

      const image = grayToImage( average )

      assert.deepEqual( image, expectPatternFromAverage )
    })

    it( 'bad arguments', () => {
      assert.throws( () => fromAverage( pattern, 0, 0, 0, 0 ) )
    })

    it( 'out of bounds', () => {
      const average = fromAverage( patternBorder, -2, -2, 20, 20 )

      const image = grayToImage( average )

      assert.deepEqual( image, expectPatternFromAverageOutOfBounds )
    })
  })

  describe( 'fromLightness', () => {
    it( 'from lightness values', () => {
      const lightness = fromLightness( pattern )

      const image = grayToImage( lightness )

      assert.deepEqual( image, expectPatternFromLightness )
    } )

    it( 'bad arguments', () => {
      assert.throws( () => fromLightness( pattern, 0, 0, 0, 0 ) )
    } )

    it( 'out of bounds', () => {
      const lightness = fromLightness( patternBorder, -2, -2, 20, 20 )

      const image = grayToImage( lightness )

      assert.deepEqual( image, expectPatternFromLightnessOutOfBounds )
    } )
  } )

  describe( 'combineChannels', () => {
    it( 'combines channels', () => {
      const channels = extractRgba( pattern )
      const combined = combineChannels( ...channels )

      assert.deepEqual( combined, pattern )
    })

    it( 'bad arguments', () => {
      const [ r, g, b ] = extractRgba( pattern )

      assert.throws( () => combineChannels( r, g, b, createGray( 4, 4 ) ) )
    })
  })
})
