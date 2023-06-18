const { validationResult } = require("express-validator");

exports.validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error(errors.errors[0].msg);
    console.log("gg");
    error.statusCode = 400; // Set the status code for the error
    return next(error);
  }

  next();
};
