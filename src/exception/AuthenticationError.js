class AuthenticationError extends Error {
    constructor(message) {
      super(message, 401);
      this.statusCode = 401;
      this.name = 'AuthenticationError';
    }
}
   
module.exports = AuthenticationError;