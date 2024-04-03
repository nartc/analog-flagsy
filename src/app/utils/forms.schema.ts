import { z } from 'zod';

export const emailValidator = z
	.string({ required_error: 'Email is required' })
	.email('Invalid email address');

export const passwordValidator = z
	.string({ required_error: 'Password is required' })
	.min(1, { message: 'Password is required' });
