require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumService = require('./services/AlbumService');
const songs = require('./api/songs');
const SongService = require('./services/SongService');


const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumService
    }
  });

  await server.register({
    plugin: songs,
    optios: {
      service: songService
    }
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
