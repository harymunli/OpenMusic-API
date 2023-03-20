const SongHandler = require('./handler');
const routes = require('./routes');
const SongService = require('../../services/SongService');

const songs = {
    name: 'songs',
    version: '1.0.0',
    register: async (server) => {
        songService = new SongService();
        const songHandler = new SongHandler(songService);
        server.route(routes(songHandler));
    },
}

module.exports =  songs;