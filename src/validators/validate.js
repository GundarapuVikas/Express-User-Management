const Joi=require("joi");
const schema=Joi.object({
    id:Joi.string(),
    login:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password:Joi.string().alphanum().required(),
    age:Joi.number().min(4).max(130).required(),
    isDeleted:Joi.boolean()
});

module.exports={schema};
