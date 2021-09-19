import Joi from "joi";
export const createImageValidator = Joi.object({
  permission: Joi.string().valid("public", "private").required().messages({
    "any.only": "permission could only be public or private",
    "any.required": "permission is required"
  })
});
