import {
	Value,
	Color,
	AspectRatio,
} from './entities';

export * from './entities';

export function useFormat() {
	
	const isValueValid = (value) => Value.validate(value);
	const isColorValid = (value) => Color.validate(value);
	const isAspectValid = (value) => AspectRatio.validate(value);
	
	const parseValue = (value, unit = 'px') => Value.parse(value, unit);
	const parseColor = (value) => Color.parse(value);
	const parseRatio = (value) => AspectRatio.parse(value);
	
	const parse = (value) => {
		
		if (Value.validate(value)) {
			return Value.parse(value);
		}
		
		if (Color.validate(value)) {
			return Color.parse(value);
		}
		
		if (AspectRatio.validate(value)) {
			return AspectRatio.parse(value);
		}
		
		return null;
	};
	
	return {
		isValueValid,
		isColorValid,
		isAspectValid,
		parseValue,
		parseColor,
		parseRatio,
		parse,
	};
}