"use strict";
const Joi = require("joi");
const pick = require("./pick");
const { http_codes } = require("./constant");

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (error) {
    console.log("error", error);
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return res
      .status(http_codes.badRequest)
      .json({
        code: http_codes.badRequest,
        data: {},
        message: errorMessage,
      });
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
