const Hapi = require('@hapi/hapi');
const AlbumService = require('./services/AlbumService');
const albums = require('./api/albums');
const AlbumsValidator = require('./validator/albums');

const init = async () => {
  const albumService = new AlbumService();
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // try{
    await server.register({
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumsValidator
      }
    });
  // }catch(e){
  //   //
  // }

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
