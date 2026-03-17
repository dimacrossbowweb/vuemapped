import { Block, Element } from './entities';

export function useBem( blockName, options = {} ) {

	try {

		if ( typeof blockName !== 'string' || !blockName.trim() ) {

			throw new Error( 'useBem :: invalid block class. Expected not empty string' );

		}

	} catch ( e ) {

		console.error( e );

	}

	const block = new Block( blockName );

	const element = function ( elementName, options = {} ) {

		return new Element( block, elementName );

	};

	return {

		block,
		element,

	};

};
