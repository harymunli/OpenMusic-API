const ClientError = require('./ClientError');

class BadRequestError extends ClientError {
    constructor(message) {
      super(message, 400);
      this.statusCode = 400;
      this.name = 'BadReqestError';
    }
}
  
  module.exports = BadRequestError;
  