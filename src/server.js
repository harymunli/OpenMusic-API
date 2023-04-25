require('dotenv').config();
const path = require('path');

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

// Album
const albums = require('./api/albums');
const pgAlbumService = require('./services/postgres/pgAlbumService');
const StorageService = require('./services/storage/StorageService');


// Song
const songs = require('./api/songs');
const pgSongService = require('./services/postgres/pgSongService');

// User
const users = require('./api/users');
const pgUserService = require('./services/postgres/pgUserService');

// Authentications
const authentications = require('./api/authentications');
const TokenManager = require('./tokenize/TokenManager');
const pgAuthenticationService = require('./services/postgres/pgAuthenticationService.js');

// Playlist
const playlists = require('./api/playlist');
const pgPlaylistService = require('./services/postgres/pgPlaylistService');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');

const init = async () => {
  const albumService = new pgAlbumService();
  const songService = new pgSongService();
  const userService = new pgUserService();
  const authenticationsService = new pgAuthenticationService();
  const playlistService = new pgPlaylistService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/cover'))


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
    {
      plugin: Inert,
    }
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
        service1: albumService,
        service2: storageService,
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
      plugin: playlists,
      options: {
        service: playlistService
      }
    },
    {
      plugin: authentications, 
      options: {
        authenticationsService,
        userService,
        tokenManager: TokenManager
      }
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        service2: playlistService
      },
    },
]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
