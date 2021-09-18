import Joi from "joi";
import {
  email,
  firstName,
  lastName,
  password,
  passwordConfirm
} from "./globalSchemas";

export const signupValidator = Joi.object({
  email,
  firstName,
  lastName,
  password,
  passwordConfirm,
  profileImageUrl: Joi.string()
});

export const loginValidator = Joi.object({
  email,
  password
});
