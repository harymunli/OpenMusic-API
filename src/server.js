require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const pgAlbumService = require('./services/postgres/pgAlbumService');
const songs = require('./api/songs');
const pgSongService = require('./services/postgres/pgSongService');

const init = async () => {
  const albumService = new pgAlbumService();
  const songService = new pgSongService();
  
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
