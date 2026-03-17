import { htmlReservedColors } from '../../entities';

export function colorByName ( name ) {

	return htmlReservedColors.find( ( item ) => item.name.trim().toLowerCase() === name.trim().toLowerCase() )?.value || null;

}
