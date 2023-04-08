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
    },
    {
      method: 'DELETE',
      path:'/playlists/{id}/songs',
      handler: (request, h) => handler.deleteSongFromPlaylistHandler(request, h)
    },
    {
      method: 'DELETE',
      path:'/playlists/{id}',
      handler: (request, h) => handler.deletePlaylistHandler(request, h)
    }
  ];
   
  module.exports = routes;