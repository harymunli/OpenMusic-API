const { headers } = require('@hapi/hapi/lib/validation');
const BadRequestError = require('../../exception/BadRequestError');
const { AlbumPayloadSchema, ImageHeadersSchema } = require('./schema');

function validateAlbumPayload(payload) {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
        throw new BadRequestError(validationResult.error.message);
    }
}

function validateImageHeaders(header){
    delete header['content-disposition'];
    const validationResult = ImageHeadersSchema.validate(header);
 
    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
}

module.exports = {validateAlbumPayload, validateImageHeaders};