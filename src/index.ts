import { GrayData, CreateImage, rgbaToUint32, isLittleEndian } from '@rgba-image/common'
import { CreateImageFactory, createImage } from '@rgba-image/create-image'

const create = CreateImageFactory( [ 0 ], 1 )

export const createGray = ( width: number, height: number, data?: Uint8ClampedArray ) =>
  <GrayData>create( width, height, data )

export type Channel = 0 | 1 | 2 | 3

export const RED_CHANNEL = 0
export const GREEN_CHANNEL = 1
export const BLUE_CHANNEL = 2
export const ALPHA_CHANNEL = 3

export const extractChannel = ( source: ImageData, channel: Channel, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy ) => {
  channel = <Channel>( channel | 0 )
  sx = sx | 0
  sy = sy | 0
  sw = sw | 0
  sh = sh | 0

  if ( sw <= 0 || sh <= 0 ) throw Error( 'Cannot create an image with 0 width or height' )
  if( channel < 0 || channel > 3 ) throw Error( 'channel must be 0-3' )

  const dest = createGray( sw, sh )

  for( let y = 0; y < sh; y++ ){
    const sourceY = sy + y

    if ( sourceY < 0 || sourceY >= source.height ) continue

    for( let x = 0; x < sw; x++ ){
      const sourceX = sx + x

      if ( sourceX < 0 || sourceX >= source.width ) continue

      const sourceIndex = ( sourceY * source.width + sourceX ) * 4 + channel
      const destIndex = y * dest.width + x

      dest.data[ destIndex ] = source.data[ sourceIndex ]
    }
  }

  return dest
}

export const extractRed = ( source: ImageData, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy ) =>
  extractChannel( source, RED_CHANNEL, sx, sy, sw, sh )

export const extractGreen = ( source: ImageData, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy ) =>
  extractChannel( source, GREEN_CHANNEL, sx, sy, sw, sh )

export const extractBlue = ( source: ImageData, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy ) =>
  extractChannel( source, BLUE_CHANNEL, sx, sy, sw, sh )

export const extractAlpha = ( source: ImageData, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy ) =>
  extractChannel( source, ALPHA_CHANNEL, sx, sy, sw, sh )

export type ChannelData = [ GrayData, GrayData, GrayData, GrayData ]

export const extractRgba = ( source: ImageData, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy ) => {
  sx = sx | 0
  sy = sy | 0
  sw = sw | 0
  sh = sh | 0

  if ( sw <= 0 || sh <= 0 ) throw Error( 'Cannot create an image with 0 width or height' )

  const r = createGray( sw, sh )
  const g = createGray( sw, sh )
  const b = createGray( sw, sh )
  const a = createGray( sw, sh )

  for ( let y = 0; y < sh; y++ ) {
    const sourceY = sy + y

    if ( sourceY < 0 || sourceY >= source.height ) continue

    for ( let x = 0; x < sw; x++ ) {
      const sourceX = sx + x

      if ( sourceX < 0 || sourceX >= source.width ) continue

      const destIndex = y * sw + x
      const sourceIndex = ( sourceY * source.width + sourceX ) * 4

      r.data[ destIndex ] = source.data[ sourceIndex ]
      g.data[ destIndex ] = source.data[ sourceIndex + 1 ]
      b.data[ destIndex ] = source.data[ sourceIndex + 2 ]
      a.data[ destIndex ] = source.data[ sourceIndex + 3 ]
    }
  }

  return <ChannelData>[ r, g, b, a ]
}

export const maskImage = ( source: GrayData, dest: ImageData, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy, dx = 0, dy = 0 ) => {
  sx = sx | 0
  sy = sy | 0
  sw = sw | 0
  sh = sh | 0
  dx = dx | 0
  dy = dy | 0

  if ( sw <= 0 || sh <= 0 ) return

  for ( let y = 0; y < sh; y++ ) {
    const sourceY = sy + y

    if ( sourceY < 0 || sourceY >= source.height ) continue

    const destY = dy + y

    if ( destY < 0 || destY >= dest.height ) continue

    for ( let x = 0; x < sw; x++ ) {
      const sourceX = sx + x

      if ( sourceX < 0 || sourceX >= source.width ) continue

      const destX = dx + x

      if ( destX < 0 || destX >= dest.width ) continue

      const sourceIndex = sourceY * source.width + sourceX
      const destIndex = ( destY * dest.width + destX ) * 4 + 3

      dest.data[ destIndex ] *= ( source.data[ sourceIndex ] / 255 )
    }
  }
}

export const fromAverage = ( source: ImageData, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy ) => {
  sx = sx | 0
  sy = sy | 0
  sw = sw | 0
  sh = sh | 0

  if ( sw <= 0 || sh <= 0 ) throw Error( 'Cannot create an image with 0 width or height' )

  const dest = createGray( sw, sh )

  for ( let y = 0; y < sh; y++ ) {
    const sourceY = sy + y

    if ( sourceY < 0 || sourceY >= source.height ) continue

    for ( let x = 0; x < sw; x++ ) {
      const sourceX = sx + x

      if ( sourceX < 0 || sourceX >= source.width ) continue

      const sourceIndex = ( sourceY * source.width + sourceX ) * 4
      const destIndex = y * dest.width + x

      const r = source.data[ sourceIndex ]
      const g = source.data[ sourceIndex + 1 ]
      const b = source.data[ sourceIndex + 2 ]

      dest.data[ destIndex ] = ( r + g + b ) / 3
    }
  }

  return dest
}

export const fromLightness = ( source: ImageData, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy ) => {
  sx = sx | 0
  sy = sy | 0
  sw = sw | 0
  sh = sh | 0

  if ( sw <= 0 || sh <= 0 ) throw Error( 'Cannot create an image with 0 width or height' )

  const dest = createGray( sw, sh )

  for ( let y = 0; y < sh; y++ ) {
    const sourceY = sy + y

    if ( sourceY < 0 || sourceY >= source.height ) continue

    for ( let x = 0; x < sw; x++ ) {
      const sourceX = sx + x

      if ( sourceX < 0 || sourceX >= source.width ) continue

      const sourceIndex = ( sourceY * source.width + sourceX ) * 4
      const destIndex = y * dest.width + x

      const r = source.data[ sourceIndex ]
      const g = source.data[ sourceIndex + 1 ]
      const b = source.data[ sourceIndex + 2 ]

      dest.data[ destIndex ] = r * 0.2126 + g * 0.7152 + b * 0.0722
    }
  }

  return dest
}

export const GrayToImageFactory = ( createImage: CreateImage ) => {
  const grayToImage = ( source: GrayData, sx = 0, sy = 0, sw = source.width - sx, sh = source.height - sy, alpha = 255 ) => {
    sx = sx | 0
    sy = sy | 0
    sw = sw | 0
    sh = sh | 0
    alpha = alpha | 0

    if ( sw <= 0 || sh <= 0 ) throw Error( 'Cannot create an image with 0 width or height' )

    const dest = createImage( sw, sh )
    const destData = new Uint32Array( dest.data.buffer )

    for ( let y = 0; y < sh; y++ ) {
      const sourceY = sy + y

      if ( sourceY < 0 || sourceY >= source.height ) continue

      for ( let x = 0; x < sw; x++ ) {
        const sourceX = sx + x

        if ( sourceX < 0 || sourceX >= source.width ) continue

        const sourceIndex = sourceY * source.width + sourceX
        const destIndex = y * dest.width + x
        const gray = source.data[ sourceIndex ]

        const c = rgbaToUint32( gray, gray, gray, alpha, isLittleEndian )

        destData[ destIndex ] = c
      }
    }

    return dest
  }

  const combineChannels = ( red: GrayData, green: GrayData, blue: GrayData, alpha: GrayData ) => {
    const { width, height } = red

    if(
      green.width !== width || green.height !== height ||
      blue.width !== width || blue.height !== height ||
      alpha.width !== width || alpha.height !== height
    ) throw Error( 'All source channels must be the same size' )

    const dest = createImage( width, height )
    const destData = new Uint32Array( dest.data.buffer )

    for ( let y = 0; y < height; y++ ) {
      for ( let x = 0; x < width; x++ ) {
        const index = y * dest.width + x

        const r = red.data[ index ]
        const g = green.data[ index ]
        const b = blue.data[ index ]
        const a = alpha.data[ index ]

        const c = rgbaToUint32( r, g, b, a, isLittleEndian )

        destData[ index ] = c
      }
    }

    return dest
  }

  return { grayToImage, combineChannels }
}

export const { grayToImage, combineChannels } = GrayToImageFactory( createImage )
