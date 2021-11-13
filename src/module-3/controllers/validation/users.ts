import joi from "joi";

const userValidationSchema = joi.object().keys({
  login: joi.string().alphanum().min(3).max(10).required(),
  password: joi.string().alphanum().required(),
  age: joi.number().min(4).max(130).required()
});

export default userValidationSchema;