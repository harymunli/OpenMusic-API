const routes = (handler) => [
    {
      method: 'POST',
      path: '/export/playlists/{playlistId}',
      handler: (request, h) => handler.postExportPlaylistsHandler(request, h),
    },
  ];
   
  module.exports = routes;