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
      path:'/playlists/{id}/songs',
      handler: (request, h) => handler.postSongtoPlaylistHandler(request, h)
    },
    {
      method: 'GET',
      path:'/playlists/{id}/songs',
      handler: (request, h) => handler.getSongsFromPlaylistHandler(request, h)
    }
  ];
   
  module.exports = routes;