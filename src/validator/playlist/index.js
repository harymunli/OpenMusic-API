const BadRequestError = require('../../exception/BadRequestError');
const { PlaylistPayloadSchema } = require('./schema');

function validatePlaylistPayload(payload) {
    const val_res = PlaylistPayloadSchema.validate(payload);
    if(val_res.error){
        throw new BadRequestError(val_res.error.message);
    }
}

module.exports = validatePlaylistPayload;