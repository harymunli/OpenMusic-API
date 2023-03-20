const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumService = require('./services/AlbumService');
const songs = require('./api/songs');
const SongService = require('./services/SongService');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  console.log(albumService);
  console.log(songService);
  
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
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
