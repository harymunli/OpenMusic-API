const routes = require('./routes');
const AuthenticationsHandler = require('./handler');

module.exports = {
    name: 'auth',
    version: '1.0.0',
    register: async (server, {
        authenticationsService, 
        userService, 
        tokenManager
    }) => {
        const authenticationHandler = new AuthenticationsHandler(
            authenticationsService,
            userService,
            tokenManager
        );
        server.route(routes(authenticationHandler));
    }
}