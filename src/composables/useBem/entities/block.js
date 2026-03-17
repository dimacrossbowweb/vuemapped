import { Base } from './base';

export class Block extends Base {

	constructor ( name ) {

		super( name );

	}

	get name () {

		return this._name;

	}

}
