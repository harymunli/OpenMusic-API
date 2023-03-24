const { response } = require("@hapi/hapi/lib/validation");
const BadReqestError = require("../../exception/BadRequestError");
const NotFoundError = require('../../exception/NotFoundError');
const validateSongPayload = require("../../validator/songs");


class SongHandler {
    constructor(service){
        this._service = service;
    }

    async postSongHandler(request, h){
        let response = {}
        try{
            validateSongPayload(request.payload);
            const{title, year, genre, performer, duration} = request.payload;
            const songId = await this._service.addSong({title, year, genre, performer, duration});
            response = h.response({
                status: 'success',
                data: {
                    songId: songId
                }
            })
            response.code(201);
            return response;
        }catch(e){
            if(e instanceof BadReqestError){
                response = h.response({
                    status: 'fail',
                    message: e.message
                });
                response.code(400);
                return response;
            }else if(e instanceof NotFoundError){
                const response = h.response({
                    status: 'fail',
                    message: "lagu tidak ditemukan"
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

    async getSongByIdHandler(request, h){
        try{
            const {id} = request.params;
            const song = await this._service.getSongById(id);
            const response = h.response({
                status: 'success',
                data : {
                    song : song[0],
                }
            });
            response.code(200);
            return response;
            
        }catch(e){
            if(e instanceof NotFoundError){
                const response = h.response({
                    status: 'fail',
                    message: "Lagu tidak ditemukan"
                });
                response.code(404);
                return response;
            }
        }
    }

    async getSongsHandler(request, h){
        let response = {}
        try{
            const songs = await this._service.getSongs();
            response = h.response({
                status: 'success',
                data : {
                    songs : songs,
                }
            });
            response.code(200);
            return response;
        }catch(e){
            response = h.response({
                status: 'error',
                message: e.message
            });
            response.code(500);
            return response;
        }
    }

    async putSongByIdHandler(request, h) {
        try{
            const {id} = request.params;
            await this._service.getSongById(id);
            validateSongPayload(request.payload);
            await this._service.editSongById(id, request.payload);
            let res = h.response({
                status: 'success',
                message: "Album berhasil diperbaharui"
            });
            res.code(200);
            return res;
        } catch(e) {
            if(e instanceof NotFoundError){
                const response = h.response({
                    status: 'fail',
                    message: "Lagu tidak ditemukan"
                });
                response.code(404);
                return response;
            }
            if(e instanceof BadReqestError){
                const response = h.response({
                    status: 'fail',
                    message: e.message,
                });
                response.code(400);
                return response;
            }
            let res = h.response({
                status: 'error',
                message: e.message
            });
            res.code(500);
            return res;
        }
    }
    
    async deleteSongByIdHandler(request, h){
        try{
            const { id } = request.params;
            await this._service.getSongById(id);
            await this._service.deleteSongById(id);
            let res = h.response({
                status: 'success',
                message: "Album berhasil diperbaharui"
            });
            res.code(200);
            return res;
        }catch(e){
            if(e instanceof NotFoundError){
                const response = h.response({
                    status: 'fail',
                    message: "Lagu tidak ditemukan"
                });
                response.code(404);
                return response;
            }
        }

        const response = h.response({
            status: "success",
            message: "Album berhasil dihapus"
        });
        response.code(200);
        return response;
    }
}

module.exports = SongHandler;