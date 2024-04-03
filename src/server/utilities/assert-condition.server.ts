export function assertCondition(
	condition: boolean,
	cb: () => void,
): asserts condition {
	if (!condition) {
		cb();
		return;
	}
}
