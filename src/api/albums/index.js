const AlbumHandler = require('./handler');
const routes = require('./routes');
const pgAlbumService = require('../../services/postgres/pgAlbumService');
const StorageService = require('../../services/storage/StorageService');
const path = require('path');

const albums = {
  name: 'albums',
  version: '1.0.0',
  register: async (server) => {
    albumService = new pgAlbumService();
    storageService = new StorageService(path.resolve(__dirname, 'file/cover'));
    const albumHandler = new AlbumHandler(albumService, storageService);
    server.route(routes(albumHandler));
  },
};

module.exports = albums;