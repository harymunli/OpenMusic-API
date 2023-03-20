const { response } = require("@hapi/hapi/lib/validation");
const BadReqestError = require("../../exception/BadRequestError");


class SongHandler {
    constructor(service){
        this._service = service;
        this.postSongHandler = this.postSongHandler.bind(this);
    }

    postSongHandler(request, h){
        let response = {}
        console.log(this._service);
        try{
            const{title, year, genre, perfomer, duration, albumId} = request.payload;
            const songId = this._service.addSong({title, year, genre, perfomer, duration, albumId});
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
}

module.exports = SongHandler;