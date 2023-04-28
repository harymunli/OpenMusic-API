const path = require('path');

const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums',
      handler: (request, h) => handler.postAlbumHandler(request, h)
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: (request, h) => handler.getAlbumByIdHandler(request, h)
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: (request, h) => handler.putAlbumByIdHandler(request, h),
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: (request, h) => handler.deleteAlbumByIdHandler(request,h),
    },
    {
      method: 'POST',
      path: '/albums/{id}/covers',
      handler: (request, h) => handler.postAlbumCoverIdHandler(request,h),
      options: {
        payload: {
          allow: 'multipart/form-data',
          multipart: true,
          output: 'stream',
          maxBytes: 512000,
        }
      }
    },
    {
      method: 'GET',
      path: '/albums/cover/{param*}',
      handler: {
        directory: {
          path: path.join(__dirname, 'api/albums/file/cover'),
        }
      },
    },
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.postAlbumLikeHandler(request, h)
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.getAlbumLikesHandler(request, h)
    },
    {
      method: 'DELETE',
      path: '/albums/{id}/likes',
      handler: (request, h) => handler.deleteAlbumLikesHandler(request, h)
    }
  ];

module.exports = routes;