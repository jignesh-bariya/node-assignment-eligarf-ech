const Joi = require("joi");

const register = {
  body: Joi.object()
    .options({ abortEarly: false })
    .keys({
      fullName: Joi.string().required().messages({
        "string.empty": "fullName should not be empty",
        "string.base": "fullName should be type of `string`",
        "any.required": "fullName should not be empty",
      }),
      email: Joi.string().email().required().messages({
        "string.empty": "fullName should not be empty",
        "string.base": "fullName should be type of `string`",
        "string.email": "Please enter valid email",
        "any.required": "fullName should not be empty",
      }),
      password: Joi.string()
        // .pattern(
        //   new RegExp(
        //     "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/"
        //   )
        // )
        .required()
        .messages({
          "string.empty": "Password should not be empty",
          // "string.pattern.base":
          //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
          "string.base": "Password should be type of `string`",
          "any.required": "Password should not be empty",
        }),
    }),
};

const login = {
  body: Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string().email().required().messages({
        "string.empty": "fullName should not be empty",
        "string.base": "fullName should be type of `string`",
        "string.email": "Please enter valid email",
        "any.required": "fullName should not be empty",
      }),
      password: Joi.string()
        // .pattern(
        //   new RegExp(
        //     "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/"
        //   )
        // )
        .required()
        .messages({
          "string.empty": "Password should not be empty",
          // "string.pattern.base":
          //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
          "string.base": "Password should be type of `string`",
          "any.required": "Password should not be empty",
        }),
    }),
};

module.exports = {
  register,
  login,
};
