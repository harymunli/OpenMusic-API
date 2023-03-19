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
                    albumid: albumId
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
        try{
            const {id} = request.params;
            this._service.editAlbumById(id, request.payload);
            const response = h.response({
                status: 'success',
                message: "Album berhasil diperbaharui"
            })
            response.code(200);
            return response;
        }catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }

    deleteAlbumByIdHandler(request, h){
        try {
            const { id } = request.params;
            this._service.deleteAlbumById(id);
            const response = {
                status: "success",
                message: "Album berhasil dihapus"
            };
            response.code(200);
            return response
        }catch(e){
            const response = h.response({
                status: 'fail',
                message: 'Catatan gagal dihapus. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = AlbumHandler;