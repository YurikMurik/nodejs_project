import joi from 'joi';
import { UserRequest } from './types';

const schema = joi.object().keys({
    login: joi.string().alphanum().min(3).max(10).required(),
    password: joi.string().alphanum().required(),
    age: joi.number().min(4).max(130).required(),
    isDeleted: joi.boolean().required()
});

export const validate = (obj: UserRequest) =>
    schema.validate(obj).error;
