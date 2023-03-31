const BadRequestError = require('../../exception/BadRequestError');
const { UserPayloadSchema } = require('./schema');

const UserValidator = {
    validateUserPayload: (payload) =>{
        validationResult = UserPayloadSchema.validate(payload);

        if (validationResult.error){
            throw new BadRequestError('validationResult.error.message');
        }
    }
};

module.exports = UserValidator;