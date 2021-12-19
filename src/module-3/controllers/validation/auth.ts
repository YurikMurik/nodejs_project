import joi from "joi";

export const loginValidationSchema = joi.object().keys({
  login: joi.string().alphanum().min(3).max(10).required(),
  password: joi.string().alphanum().required()
});

export const updTokenValidationSchema = joi.object().keys({
  login: joi.string().alphanum().min(3).max(10).required(),
  password: joi.string().alphanum().required(),
  refreshToken: joi.string().required()
});
