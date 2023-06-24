module.exports = class ErrorWithDetail extends Error {
    // eslint-disable-next-line require-jsdoc
    constructor(message, error, data = "") {
        super(message);
        this.detail = typeof error === "string" ? error :
            `${error?.message || error || ""}`;
        this.data = data;
    }
};
