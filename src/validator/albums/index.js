const BadReqestError = require('../../exception/BadRequestError');
const { NotePayloadSchema } = require('./schema');

function validateNotePayload(payload) {
    const validationResult = NotePayloadSchema.validate(payload);
    if (validationResult.error) {
        throw new BadReqestError(validationResult.error.message);
    }
}

module.exports = validateNotePayload;
