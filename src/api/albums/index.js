const AlbumHandler = require('./handler');
const routes = require('./routes');

const albums = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {service, exception}) => {
    const albumHandler = new AlbumHandler(service, exception);
    server.route(routes(albumHandler));
  },
};

module.exports = albums;