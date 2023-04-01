require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Album
const albums = require('./api/albums');
const pgAlbumService = require('./services/postgres/pgAlbumService');

// Song
const songs = require('./api/songs');
const pgSongService = require('./services/postgres/pgSongService');

// User
const users = require('./api/users');
const pgUserService = require('./services/postgres/pgUserService');

// authentications
const authentications = require('./api/authentications');
const TokenManager = require('./tokenize/TokenManager');
const pgAuthenticationService = require('./services/postgres/pgAuthenticationService.js');


const init = async () => {
  const albumService = new pgAlbumService();
  const songService = new pgSongService();
  const userService = new pgUserService();
  const authenticationsService = new pgAuthenticationService();
  
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService
      }
    },
    {
      plugin: songs,
      optios: {
        service: songService
      }
    },
    {
      plugin: users,
      options: {
        service: userService
      }
    },
    {
      plugin: authentications, 
      options: {
        authenticationsService,
        userService,
        tokenManager: TokenManager
      }
    }
]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
