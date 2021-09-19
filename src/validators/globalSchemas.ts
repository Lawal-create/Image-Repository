import Joi from "joi";
// import { checkMongoIdMethod } from "../utils/helpers/checkMongoId";

export const emailRegex =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
export const phoneNumberRegex = /^[0-9]+$/;

export const email = Joi.string().required().email().messages({
  "string.email": "Email address is invalid",
  "any.required": "Email address is required"
});

export const password = Joi.string().required().min(8).messages({
  "string.min": "Password must contain at least 8 characters",
  "any.required": "Password is required"
});

export const firstName = Joi.string().required().messages({
  "any.required": "First Name is required"
});
export const lastName = Joi.string().required().messages({
  "any.required": "Last Name is required"
});

export const passwordConfirm = Joi.string()
  .required()
  .valid(Joi.ref("password"))
  .messages({
    "any.required": "Password confirm is required",
    "any.only": "Passwords must match"
  });

export const date = Joi.date().iso();
export const startTime = date
  .min(new Date().toISOString())
  .default(new Date().toISOString())
  .messages({
    "any.only": "Start time must be greater than current time"
  });

export const endTime = date.min(Joi.ref("startTime")).messages({
  "any.only": "End time must be greater than start time"
});

export const stringRequiredValidator = (name: string): Joi.StringSchema => {
  return Joi.string()
    .required()
    .messages({
      "any.required": `${name} is required`
    });
};

export const queryParamsValidator = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(10),
  date,
  startDate: date,
  endDate: startTime.min(Joi.ref("startDate")).messages({
    "any.only": "End date must be greater than start date"
  }),
  sortBy: Joi.string().valid("date").messages({
    "any.only": "sortBy should be date"
  }),
  direction: Joi.string().valid("asc", "desc"),
  permission: Joi.string().valid("public", "private").messages({
    "any.only": "permission could only be public or private"
  })
});
