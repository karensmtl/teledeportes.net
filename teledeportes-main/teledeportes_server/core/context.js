// Request-scoped context. Lets any layer (managers, assemblers, hooks)
// read the current request id and authenticated user without dependency
// injection. Backed by AsyncLocalStorage — propagates through async
// boundaries automatically.
//
// Set by middlewares/observability/request_context.js at the top of the
// request pipeline. Read via getContext() / getRequestId() / getUserId().
const { AsyncLocalStorage } = require('node:async_hooks');

const storage = new AsyncLocalStorage();

function run(seed, fn) {
    return storage.run({ ...seed }, fn);
}

function getContext() {
    return storage.getStore() || null;
}

function getRequestId() {
    return getContext()?.requestId || null;
}

function getUserId() {
    return getContext()?.userId || null;
}

function setUser(user) {
    const ctx = storage.getStore();
    if (!ctx || !user) return;
    ctx.userId = user.id;
    ctx.userRole = user.role;
}

module.exports = { run, getContext, getRequestId, getUserId, setUser };
