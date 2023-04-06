const routes = (handler) => [
    {
      method: 'POST',
      path: '/playlists',
      handler: (request, h) => handler.postPlaylistHandler(request, h)
    },
    {
      method: 'GET',
      path: '/playlists',
      handler: (request, h) => handler.getAllPlaylistHandler(request, h),
    },
    // {
    //   method: 'PUT',
    //   path: '/authentications',
    //   handler: (request, h) => handler.putAuthenticationHandler(request, h),
    // },
    // {
    //   method: 'DELETE',
    //   path: '/authentications',
    //   handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
    // },
  ];
   
  module.exports = routes;