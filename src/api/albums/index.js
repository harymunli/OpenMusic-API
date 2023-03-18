const AlbumHandler = require('./handler');
const routes = require('./routes');
const AlbumService = require('../../services/AlbumService');

const albums = {
  name: 'albums',
  version: '1.0.0',
  register: async (server) => {
    albumService = new AlbumService() 
    albumHandler = new AlbumHandler(albumService);
    server.route(routes(albumHandler));
  },
};

module.exports = albums;