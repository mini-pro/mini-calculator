module.exports = app => {
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            console.error("filter Error", error);
            return ctx.socket.emit('err', "err: "+error);
        }
    };
};

