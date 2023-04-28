const { response, params } = require('@hapi/hapi/lib/validation');
const ClientError = require('../../exception/ClientError');
const NotFoundError = require('../../exception/NotFoundError');
const AuthenticationError = require('../../exception/AuthenticationError');
const {validateAlbumPayload, validateImageHeaders} = require('../../validator/albums');
const TokenManager = require('../../tokenize/TokenManager');


class AlbumHandler {
    constructor(service, service2){
        this._service = service;
        this._service2 = service2;
    }

    async postAlbumHandler(request, h){
        try{
            validateAlbumPayload(request.payload);            
            const{name, year} = request.payload;
            const albumId = await this._service.addAlbum({ name, year});
            const response = h.response({
                status: 'success',
                data: {
                    albumId: albumId
                }
            })
            response.code(201);
            return response;
        }catch(e){
            if(e instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: e.message
                });
                response.code(e.statusCode);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: e.message
            });
            response.code(500);
            return response;
        }
    }

    async getAlbumByIdHandler(request, h){
        try{
            const {id} = await request.params;
            const album = await this._service.getAlbumById(id)
            const response = h.response({
                status: 'success',
                data : {
                    album : album,
                }
            });
            response.code(200);
            return response;
        }catch(e){
            if(e instanceof NotFoundError){
                const response = h.response({
                    status: 'fail',
                    message: "Album tidak ditemukan"
                });
                response.code(404);
                return response;
            }
        }
    }

    async putAlbumByIdHandler(request, h) {
        try{
            const {id} = await request.params;
            await this._service.getAlbumById(id);

            validateAlbumPayload(request.payload);
            this._service.editAlbumById(id, request.payload);
            const response = h.response({
                status: 'success',
                message: "Album berhasil diperbaharui"
            })
            response.code(200);
            return response;
        }catch (e) {
            if(e instanceof ClientError){
                const response = h.response({
                    status: 'fail',
                    message: e.message,
                });
                response.code(e.statusCode);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: e.message
            });
            response.code(500);
            return response;
        }
    }

    async deleteAlbumByIdHandler(request, h){
        try{
            const { id } = request.params;
            const album = await this._service.getAlbumById(id);

            if(!album){
                const response = h.response({
                    status: 'fail',
                    message: "Album tidak ditemukan"
                })
                response.code(404);
                return response;
            }

            await this._service.deleteAlbumById(id);

            let response = h.response({
                status: "success",
                message: "Album berhasil dihapus"
            });
            response.code(200);
            return response;   
        }catch(e){
            if(e instanceof NotFoundError){
                const response = h.response({
                    status: 'fail',
                    message: "Album tidak ditemukan"
                })
                response.code(404);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: e.message
            });
            response.code(500);
            return response;
        }
    }

    async postAlbumCoverIdHandler(request, h){
        try {
            const file = request.payload;
            validateImageHeaders(file.cover.hapi.headers);
            const filename = await this._service2.writeFile(file.cover, file.cover.hapi.filename);
            await this._service.addCoverURLToAlbum(filename, request.params.id);

            const response = h.response({
                status: 'success',
                message: "Permintaan Anda sedang kami proses",
            });
            response.code(201);
            return response;          
        } catch (error){
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                })
                response.code(error.statusCode);
                return response;
            }
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
              });
              response.code(500);
              console.error(error);
              return response;
        }
    }

    async postAlbumLikeHandler(req, h){
        try{
            const album_id =  req.params.id;
            if(!req.headers.authorization) throw new AuthenticationError("Anda belum login, silahkan login terlebih dahulu");
            
            const token = req.headers.authorization.split(" ")[1];
            const user_id = await TokenManager.getPayloadFromToken(token).id;

            await this._service.addRowToUserAlbumLike(user_id, album_id)
            
            const response = h.response({
                status: 'success',
                message: "Like berhasil"
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
}

module.exports = AlbumHandler;