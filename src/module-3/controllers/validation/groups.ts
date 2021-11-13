import joi from "joi";

export default joi.object().keys({
  name: joi.string().alphanum().min(3).max(10).required(),
  permissions: joi.array().required()
});
