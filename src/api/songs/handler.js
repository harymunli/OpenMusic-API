const { response } = require("@hapi/hapi/lib/validation");
const BadReqestError = require("../../exception/BadRequestError");
const validateSongPayload = require("../../validator/songs");


class SongHandler {
    constructor(service){
        this._service = service;
    }

    postSongHandler(request, h){
        let response = {}
        try{
            validateSongPayload(request.payload);
            const{title, year, genre, performer, duration, albumId} = request.payload;
            const songId = this._service.addSong({title, year, genre, performer, duration, albumId});
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
            }
            response = h.response({
                status: 'error',
                message: e.message
            });
            response.code(500);
            return response;
        }
    }

    getSongByIdHandler(request, h){
        const {id} = request.params;
        const song = this._service.getSongById(id);

        if(!song){
            const response = h.response({
                status: 'fail',
                message: "Song tidak ditemukan"
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            data : {
                song : song,
            }
        });
        response.code(200);
        return response;
    }

    getSongsHandler(request, h){
        let response = {}
        try{
            const songs = this._service.getSongs();
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

    putSongByIdHandler(request, h) {
        const {id} = request.params;
        const song = this._service.getSongById(id);

        if(!song){
            const response = h.response({
                status: 'fail',
                message: "Lagu tidak ditemukan"
            })
            response.code(404);
            return response;
        }

        try{
            validateSongPayload(request.payload);
            this._service.editSongById(id, request.payload);
            const response = h.response({
                status: 'success',
                message: "Album berhasil diperbaharui"
            });
            response.code(200);
            return response;
        } catch(e) {
            if(e instanceof BadReqestError){
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
        const song = this._service.getSongById(id);

        if(!song){
            const response = h.response({
                status: 'fail',
                message: "Album tidak ditemukan"
            })
            response.code(404);
            return response;
        }

        this._service.deleteSongById(id);

        const response = h.response({
            status: "success",
            message: "Album berhasil dihapus"
        });
        response.code(200);
        return response;
    }
}

module.exports = SongHandler;