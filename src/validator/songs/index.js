const BadReqestError = require('../../exception/BadRequestError');
const { SongPayloadSchema } = require('./schema');

function validateSongPayload(payload) {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
        throw new BadReqestError(validationResult.error.message);
    }
}

module.exports = validateSongPayload;
