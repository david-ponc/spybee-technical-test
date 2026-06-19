import { Input as BaseInput } from '@base-ui/react/input';

import { cnWithState } from '~/core/lib/cn';

import styles from './input.module.scss';

function Input({ className, type, ...props }: BaseInput.Props) {
	return (
		<BaseInput
			type={type}
			data-slot='input'
			className={cnWithState(styles.input, className)}
			autoComplete='off'
			autoCorrect='off'
			spellCheck={false}
			{...props}
		/>
	);
}

export { BaseInput, Input };
