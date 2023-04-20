const ClientError = require('../../exception/ClientError');
const ExportsValidator = require('../../validator/exports');
const AuthenticationError = require('../../exception/AuthenticationError');
const TokenManager = require('../../tokenize/TokenManager');
const pgPlaylistService = require('../../services/postgres/pgPlaylistService');
const ForbiddenError = require('../../exception/ForbiddenError');

class ExportsHandler {
    constructor(service) {
      this._service = service;
      this._service2 = new pgPlaylistService();
    }

    async postExportPlaylistsHandler(request, h) {
        try {
            if(!request.headers.authorization) throw new AuthenticationError("Anda belum login, silahkan login terlebih dahulu");
            ExportsValidator.validateExportPlaylistsPayload(request.payload);
            
            const token = request.headers.authorization.split(" ")[1];
            const user_id = TokenManager.getPayloadFromToken(token).id;
            const playlist_id = request.params.playlistId;
            
            // 403 forbidden error
            const owner_id = await this._service2.getOwnerIdFromPlaylist(playlist_id);
            if (user_id != owner_id) throw new ForbiddenError('Anda tidak memiliki akses playlist ini');

            const message = {
                playlistId: playlist_id,
                targetEmail: request.payload.targetEmail,
            };
            await this._service.sendMessage('export:playlist', JSON.stringify(message));

            const response = h.response({
                status: 'success',
                message: 'Permintaan Anda sedang kami proses',
              });
              response.code(201);
              return response;

        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          response.code(500);
          console.error(error);
          return response;
        }
    }
}

module.exports = ExportsHandler;