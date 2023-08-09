export default async function safeCall(fn: (x?: any) => Promise<any>) {
	const done = false;
	while (!done) {
		try {
			const res = await fn();
			return res;
		} catch (e) {
			console.log("failed", e.message, "- retrying...");
		}
	}
}
