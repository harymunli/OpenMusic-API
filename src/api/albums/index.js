const AlbumHandler = require('./handler');
const routes = require('./routes');
const pgAlbumService = require('../../services/postgres/pgAlbumService');

const albums = {
  name: 'albums',
  version: '1.0.0',
  register: async (server) => {
    albumService = new pgAlbumService() 
    const albumHandler = new AlbumHandler(albumService);
    server.route(routes(albumHandler));
  },
};

module.exports = albums;