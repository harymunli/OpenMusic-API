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
    {
      method: 'POST',
      path:'/playlists/{ownerId}/songs',
      handler: (request, h) => handler.postSongtoPlaylistHandler(request, h)
    }
  ];
   
  module.exports = routes;