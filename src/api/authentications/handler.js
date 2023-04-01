const AuthenticationError = require('../../exception/AuthenticationError');
const BadRequestError = require('../../exception/BadRequestError');
const AuthenticationsValidator = require('../../validator/Authentications');

class AuthenticationsHandler {
    constructor(authenticationsService, userService, tokenManager) {
      this._authenticationsService = authenticationsService;
      this._userService = userService;
      this._tokenManager = tokenManager;
    }
   
    async postAuthenticationHandler(request, h) {
      try {
        AuthenticationsValidator.validatePostAuthenticationPayload(request.payload);
   
        const { username, password } = request.payload;
        const id = await this._authenticationsService.verifyUserCredential(username, password);
   
        const accessToken = this._tokenManager.generateAccessToken({ id });
        const refreshToken = this._tokenManager.generateRefreshToken({ id });
   
        await this._authenticationsService.addRefreshToken(refreshToken);
   
        const response = h.response({
          status: 'success',
          message: 'Authentication berhasil ditambahkan',
          data: {
            accessToken,
            refreshToken,
          },
        });
        response.code(201);
        return response;
      } catch (error) {
        if (error instanceof BadRequestError || error instanceof AuthenticationError) {
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
   
    async putAuthenticationHandler(request, h) {
      try {
        AuthenticationsValidator.validatePutAuthenticationPayload(request.payload);

        const { refreshToken } = request.payload;
        await this._authenticationsService.verifyRefreshToken(refreshToken);
        const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
   
        const accessToken = this._tokenManager.generateAccessToken({ id });
        return {
          status: 'success',
          message: 'Access Token berhasil diperbarui',
          data: {
            accessToken,
          },
        };
      } catch (error) {
        if (error instanceof BadRequestError) {
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
   
    async deleteAuthenticationHandler(request, h) {
      try {
        AuthenticationsValidator.validateDeleteAuthenticationPayload(request.payload);
   
        const { refreshToken } = request.payload;
        await this._authenticationsService.verifyRefreshToken(refreshToken);
        await this._authenticationsService.deleteRefreshToken(refreshToken);
   
        return {
          status: 'success',
          message: 'Refresh token berhasil dihapus',
        };
      } catch (error) {
        if (error instanceof BadRequestError) {
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
   
  module.exports = AuthenticationsHandler;