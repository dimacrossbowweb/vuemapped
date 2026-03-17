import { ColorBase } from './color-base';
import { ColorRgb } from './color-rgb';
import { ColorHex } from './color-hex';
import { ColorHsl } from './color-hsl';
import { ColorRegister } from './color-register';
import { ColorKeyword } from './color-keyword';

export class Color extends ColorBase {

	constructor( format ) {

		super( 'color' );

		try {

			if ( typeof format !== 'string' ) {

				throw new Error( 'Color -> constructor :: invalid format' );

			}

			this.format = format;

		} catch ( e ) {

			console.error( e );

		}

	}

	static validate( value ) {

		return ColorRegister.validate( value ) ||
			   ColorRgb.validate( value ) ||
			   ColorHex.validate( value ) ||
			   ColorHsl.validate( value );

	}

	static parse( value ) {

		if ( typeof value !== 'string' ) { return null }

		if ( ColorKeyword.validate( value ) ) {

			return ColorKeyword.parse( value );

		}

		if ( ColorRegister.validate( value ) ) {

			return ColorRegister.parse( value );

		}

		if ( ColorRgb.validate( value ) ) {

			return ColorRgb.parse( value );

		}

		if ( ColorHex.validate( value ) ) {

			return ColorHex.parse( value );

		}

		if ( ColorHsl.validate( value ) ) {

			return ColorHsl.parse( value );

		}

		return null;

	}

}
