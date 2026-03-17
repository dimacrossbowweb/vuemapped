import { getCSSVar } from '../../global/utils';

export function useCSSVar ( name, prefix = 'ui', el = null ) {

	return getCSSVar( `${ prefix }-${ name }`, el );

}
