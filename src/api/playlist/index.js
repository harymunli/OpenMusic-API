const routes = require('./routes');
const PlaylistHandler = require('./handler');
const pgPlaylistService = require('../../services/postgres/pgPlaylistService');
const { server } = require('@hapi/hapi');

const playlist = {
    name: 'playlist',
    version: '1.0.0',
    register: async (server) => {
      playlistService = new pgPlaylistService();
      const playlistHandler = new PlaylistHandler(playlistService);
      server.route(routes(playlistHandler));
    }
}

module.exports = playlist