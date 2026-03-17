export class SnakeCase {

	static validate ( str ) {

		return /^[a-z]+(_[a-z]+)*$/.test( str );

	}

	static parse ( value ) {

		return value.split( '_' );

	}

	static toString ( words ) {

		return words
				.map( ( word ) => word.toLowerCase() )
				.join( '_' );

	}

};
