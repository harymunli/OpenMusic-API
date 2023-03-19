const { response } = require('@hapi/hapi/lib/validation');
const BadRequestError = require('../../exception/BadRequestError');
const validateNotePayload = require('../../validator/albums');

class AlbumHandler {
    constructor(service){
        this._service = service;
        this.postAlbumHandler = this.postAlbumHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    postAlbumHandler(request, h){
        let response = {};
        try{
            validateNotePayload(request.payload);            
            const{name, year} = request.payload;
            const albumId = this._service.addAlbum({ name, year});
            let response = h.response({
                status: 'success',
                data: {
                    albumId: albumId
                }
            })
            response.code(201);
            return response;
        }catch(e){
            if(e instanceof BadRequestError){
                response = h.response({
                    status: 'fail',
                    message: e.message
                });
                response.code(400);
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

    getAlbumByIdHandler(request, h){
        const {id} = request.params;
        const album = this._service.getAlbumById(id)
        
        if(!album){
            const response = h.response({
                status: 'fail',
                message: "Album tidak ditemukan"
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            data : {
                album : album,
            }
        });
        response.code(200);
        return response;
    }

    putAlbumByIdHandler(request, h) {
            const {id} = request.params;
            const album = this._service.getAlbumById(id);

            if(!album){
                const response = h.response({
                    status: 'fail',
                    message: "Album tidak ditemukan"
                })
                response.code(404);
                return response;
            }
        try{
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
            }
            response = h.response({
                status: 'error',
                message: e.message
            });
            response.code(500);
            return response;
        }
    }

    deleteAlbumByIdHandler(request, h){
        const { id } = request.params;
        const album = this._service.getAlbumById(id);

        if(!album){
            const response = h.response({
                status: 'fail',
                message: "Album tidak ditemukan"
            })
            response.code(404);
            return response;
        }

        this._service.deleteAlbumById(id);

        const response = h.response({
            status: "success",
            message: "Album berhasil dihapus"
        });
        response.code(200);
        return response
    }
}

module.exports = AlbumHandler;