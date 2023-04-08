const BadRequestError = require('../../exception/BadRequestError');
const { AlbumPayloadSchema } = require('./schema');

function validateAlbumPayload(payload) {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
        throw new BadRequestError(validationResult.error.message);
    }
}

module.exports = validateAlbumPayload;
