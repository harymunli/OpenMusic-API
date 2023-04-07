const BadRequestError = require('../../exception/BadRequestError');
const { PlaylistPayloadSchema , PlaylistSongsPayloadSchema} = require('./schema');

function validatePlaylistPayload(payload) {
    const val_res = PlaylistPayloadSchema.validate(payload);
    if(val_res.error){
        throw new BadRequestError(val_res.error.message);
    }
}

function validatePlaylistSongPayload(payload){
    const val_res = PlaylistSongsPayloadSchema.validate(payload);
    if(val_res.error){
        throw new BadRequestError(val_res.error.message);
    }
}

module.exports = {validatePlaylistPayload, validatePlaylistSongPayload};