import * as bcrypt from 'bcrypt';
import * as _jwt from 'jsonwebtoken';

const jwt = (_jwt as any)['default'] as typeof _jwt;

export async function hashPassword(rawPassword: string) {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(rawPassword, salt);
}

export function generateJwt(
	payload: Record<string, unknown>,
	isLongLived = false,
) {
	return jwt.sign(payload, 'shh', { expiresIn: isLongLived ? '7d' : '1h' });
}

export function verifyJwt<TPayload>(token: string): TPayload {
	return jwt.verify(token, 'shh') as TPayload;
}

export const inMemoryRefreshToken = new Map<string, string>();
