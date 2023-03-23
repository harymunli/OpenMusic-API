const SongHandler = require('./handler');
const routes = require('./routes');
const pgSongService = require('../../services/postgres/pgSongService');

const songs = {
    name: 'songs',
    version: '1.0.0',
    register: async (server) => {
        songService = new pgSongService();
        const songHandler = new SongHandler(songService);
        server.route(routes(songHandler));
    },
}

module.exports =  songs;