// usage: router.post('/path', validate(schema), controller)
// runs the zod schema against req.body before the request hits the controller
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid request body',
                details: result.error.errors,
            },
        });
    }
    req.body = result.data;
    next();
};

export default validate;
