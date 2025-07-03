export const batch = [];
export function cleanerThrottler(cache) {
    let interval = 500;

    return () => {
        setTimeout(function fun() {
            while (
                batch.length <= 100 &&
                cache.heap.getSize() > 0 &&
                cache.heap.peek().expiresAt < Date.now()
                ) {
                const node = cache.heap.pop();
                cache.remove(node.key, node);
                batch.push({
                    key: node.key,
                    reason: "TTL Expiration",
                });
            }

            const top = cache.heap.peek();

            if (batch.length > 0) {
                console.log(
                    `from cleanerThrottler Emitting batch eviction for ${batch.length} items`
                );
                cache.emitBatchEviction(batch);
                batch.length = 0;
            } else if (top && top.expiresAt > Date.now()) {
                interval = Math.max(500, top.expiresAt - Date.now());
            } else interval += 500;

            interval = Math.min(interval, 5000);
            setTimeout(fun, interval);
        }, interval);
    };
}