import { Base } from './base';
import { Block } from './block';

export class Element extends Base {

	block;

	constructor ( block, name ) {

		try {

			super( name );

			if ( !( block instanceof Block ) ) {

				throw new Error( 'useBem -> Element :: invalid block.' );

			}

			this.block = block;

		} catch ( e ) {

			console.error( e );

		}

	}

	get name () {

		return `${ this.block.name }__${ this._name }`;

	}

	// override classify (): string[] {

	// 	return [
			
	// 		this.name
		
	// 	];

	// }

}
