const ClientError = require('../../exception/ClientError')
const {validateUserPayload} = require('../../validator/users');

class UsersHandler {
    constructor(service) {
        this._service = service;
    }

    async postUserHandler(request, h) {
        try {
            validateUserPayload(request.payload);
            const { username, password, fullname } = request.payload;
       
            const userId = await this._service.addUser({ username, password, fullname });
       
            const response = h.response({
              status: 'success',
              data: {
                userId,
              },
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

module.exports = UsersHandler;