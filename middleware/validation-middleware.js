const { validationResult } = require("express-validator");

exports.validationMiddleware = (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new Error(errors.errors[0].msg);
  }

  next();
};
