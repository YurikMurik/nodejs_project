import joi from "joi";

export default joi.object().keys({
  login: joi.string().alphanum().min(3).max(10).required(),
  password: joi.string().alphanum().required()
});
