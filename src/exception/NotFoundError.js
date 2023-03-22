class NotFoundError extends Error {
    constructor(message) {
      super(message, 404);
      this.statusCode = 404;
      this.name = 'NotFoundError';
    }
}
  
  module.exports = NotFoundError;
  