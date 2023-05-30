const ErrorWithDetail = require("./ErrorWithDetail");

// general utility function to validate objects based on joi schema
module.exports = {
    mustValidate(schema, body) {
        const r = schema.validate(body);

        if (r.error) {
            if (r.value === undefined) {
                throw new ErrorWithDetail("Invalid Request Data",
                    "request body is missing.");
            }
            throw new ErrorWithDetail("Invalid Request Data", r.error);
        }
        return r.value;
    },
};
