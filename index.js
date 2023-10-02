const syncPromiseStore = new WeakMap();

const useAwait = (promise) => {
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
            throw data;
        default:
            throw promise.then(() => new Promise(resolve => setTimeout(resolve, 0)));
    }
};

export default useAwait;
