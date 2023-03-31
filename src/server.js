require('dotenv').config();

const Hapi = require('@hapi/hapi');

// Album
const albums = require('./api/albums');
const pgAlbumService = require('./services/postgres/pgAlbumService');
// Song
const songs = require('./api/songs');
const pgSongService = require('./services/postgres/pgSongService');
// User
const users = require('./api/users');
const pgUserService = require('./services/postgres/pgUserService');


const init = async () => {
  const albumService = new pgAlbumService();
  const songService = new pgSongService();
  const userService = new pgUserService();
  
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
  });

  await server.register({
    plugin: users,
    options: {
      service: userService
    }
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
