const Joi = require("joi");
const enumstatus = ["active", "deactive"];

const createStory = {
  body: Joi.object()
    .options({ abortEarly: false })
    .keys({
      title: Joi.string().required().messages({
        "string.empty": "title should not be empty",
        "string.base": "title should be type of `string`",
        "any.required": "title should not be empty",
      }),
      description: Joi.string().required().messages({
        "string.empty": "description should not be empty",
        "string.base": "description should be type of `string`",
        "any.required": "description should not be empty",
      }),
      location: Joi.string().required().messages({
        "string.empty": "location should not be empty",
        "string.base": "location should be type of `string`",
        "any.required": "location should not be empty",
      }),
      status: Joi.string()
        .valid(...enumstatus)
        .required()
        .messages({
          "string.empty": "status should not be empty",
          "string.base": "status should be type of `string`",
          "any.required": "status should not be empty",
        }),
    }),
};

const updateStory = {
  body: Joi.object()
    .options({ abortEarly: false })
    .keys({
      title: Joi.string().optional().messages({
        "string.base": "title should be type of `string`",
      }),
      description: Joi.string().optional().messages({
        "string.base": "description should be type of `string`",
      }),
      location: Joi.string().optional().messages({
        "string.base": "location should be type of `string`",
      }),
      status: Joi.string()
        .valid(...enumstatus)
        .optional()
        .messages({
          "string.base": "status should be type of `string`",
        }),
      status: Joi.string().optional().messages({
        "string.base": "status should be type of `string`",
      }),
    }),
};

module.exports = {
  createStory,
  updateStory,
};
