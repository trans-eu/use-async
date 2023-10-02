const syncPromiseStore = new WeakMap();

const useAwait = (...args) => {
    const [promise, fallback] = args;
    // check if fallback value was passed (could be set to undefined by purpose)
    const showFallback = args.length === 2;

    if (!syncPromiseStore.has(promise)) {
        syncPromiseStore.set(promise, { status: 'pending' });
        promise
            .then(data => ({ status: 'resolved', data }))
            .catch(data => ({ status: 'rejected', data }))
            .then((data) => {
                syncPromiseStore.set(promise, data);
            });
    }

    const { status, data } = syncPromiseStore.get(promise);

    switch (status) {
        case 'resolved':
            return data;
        case 'rejected':
            if (!showFallback) {
                throw data;
            }
            return typeof fallback === 'function' ? fallback(data) : fallback;
        default:
            throw promise.then(() => new Promise(resolve => setTimeout(resolve, 0)));
    }
};

export default useAwait;
