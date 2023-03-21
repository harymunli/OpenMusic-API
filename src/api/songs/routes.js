const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: (request, h) => handler.postSongHandler(request, h)
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: (request, h) => handler.getSongByIdHandler(request, h),
    },
    {
        method: 'GET',
        path: '/songs',
        handler: (request, h) => handler.getSongsHandler(request, h),
    }
];

module.exports = routes;