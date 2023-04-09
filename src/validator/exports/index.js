const ExportPlaylistsPayloadSchema = require('./schema');
const BadRequestError = require('../../exception/BadRequestError');

const ExportsValidator = {
    validateExportPlaylistsPayload: (payload) => {
        const validationResult = ExportPlaylistsPayloadSchema.validate(payload);

        if(validationResult.error) throw new BadRequestError(validationResult.error.message);
    }
}
module.exports = ExportsValidator;