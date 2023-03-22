const { response } = require('@hapi/hapi/lib/validation');
const BadRequestError = require('../../exception/BadRequestError');
const NotFoundError = require('../../exception/NotFoundError');
const validateNotePayload = require('../../validator/albums');

class AlbumHandler {
    constructor(service){
        this._service = service;
    }

    async postAlbumHandler(request, h){
        try{
            validateNotePayload(request.payload);            
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
            if(e instanceof BadRequestError){
                const response = h.response({
                    status: 'fail',
                    message: e.message
                });
                response.code(400);
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

            validateNotePayload(request.payload);
            this._service.editAlbumById(id, request.payload);
            const response = h.response({
                status: 'success',
                message: "Album berhasil diperbaharui"
            })
            response.code(200);
            return response;
        }catch (e) {
            if(e instanceof BadRequestError){
                const response = h.response({
                    status: 'fail',
                    message: e.message,
                });
                response.code(400);
                return response;
            }else if(e instanceof NotFoundError){
                const response = h.response({
                    status: 'fail',
                    message: "Album tidak ditemukan"
                });
                response.code(404);
                return response;
            }
            response = h.response({
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
            await this._service.deleteAlbumById(id);

            const response = h.response({
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
        }
    }
}

module.exports = AlbumHandler;