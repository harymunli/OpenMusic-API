const AuthenticationError = require('../../exception/AuthenticationError');
const ForbiddenError = require('../../exception/ForbiddenError');
const ClientError = require('../../exception/ClientError');
const {validatePlaylistPayload, validatePlaylistSongPayload} = require('../../validator/playlist');
const TokenManager = require('../../tokenize/TokenManager');

class PlaylistHandler {
    constructor(service){
        this._service = service;
    }
    async postPlaylistHandler(req, h){
        try{
            if(!req.headers.authorization) throw new AuthenticationError("Anda belum login, silahkan login terlebih dahulu");

            validatePlaylistPayload(req.payload);
            const token = req.headers.authorization.split(" ")[1];
            const {name} = req.payload;
            const owner = TokenManager.getPayloadFromToken(token).id;

            const playlistId = await this._service.addPlaylist({name,owner});
            
            const response = h.response({
                status: 'success',
                data: {
                  playlistId,
                },
              });
              response.code(201);
              return response;
        } catch(error) {
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

    async getAllPlaylistHandler(req, h){
      try{
        if(!req.headers.authorization) throw new AuthenticationError("Anda belum login, silahkan login terlebih dahulu");

        validatePlaylistPayload(req.payload);
        const token = req.headers.authorization.split(" ")[1];
        const owner_id = TokenManager.getPayloadFromToken(token).id;

        const playlist = await this._service.getAllPlaylist(owner_id);
        
        const response = h.response({
            status: 'success',
            data: {
              playlist,
            },
          });
          response.code(200);
          return response;
      }catch(error){
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

    async postSongtoPlaylistHandler(req, h){
      try{
        if(!req.headers.authorization) throw new AuthenticationError("Anda belum login, silahkan login terlebih dahulu");
        validatePlaylistSongPayload(req.payload);
        //owner id tidak ada di params, harus query ke sql
        const playlistId = req.params.id;
        const ownerId = await this._service.getOwnerIdFromPlaylist(playlistId)
        
        //403 Forbidden Error dimana token jwt tidak sama dengan owner playlist ini
        const token = req.headers.authorization.split(" ")[1];
        const userId = TokenManager.getPayloadFromToken(token).id;
        if(userId != ownerId) throw new ForbiddenError("Anda tidak memiliki akses ke playlist ini");

        const songId = req.payload;
        await this._service.addSongToPlaylist(playlistId, songId)

        const response = h.response({
          status: 'success',
          message: 'Song berhasil ditambahkan'
        });
        response.code(201);
        return response;

      }catch(error){
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

    async getSongsFromPlaylistHandler(req, h){
      try{
        if(!req.headers.authorization) throw new AuthenticationError("Anda belum login, silahkan login terlebih dahulu");
        
        const playlistId = req.params.id;
        const ownerId = await this._service.getOwnerIdFromPlaylist(playlistId);

        const token = req.headers.authorization.split(" ")[1];
        const user_id = TokenManager.getPayloadFromToken(token).id;
        if(user_id != ownerId) throw new ForbiddenError("Anda tidak memiliki akses playlist ini");
      
        const playlist = await this._service.getSongsFromPlaylist(playlistId);
        const response = h.response({
          status: 'success',
          data: {
            playlist
          },
        });
        response.code(200);
        return response;
      } catch(error){
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

module.exports = PlaylistHandler;