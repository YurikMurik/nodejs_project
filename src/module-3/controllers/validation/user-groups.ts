import joi from "joi";

export default joi.object().keys({
  userIds: joi.array().required(),
  groupId: joi.string().required()
});
