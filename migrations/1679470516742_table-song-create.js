/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('song', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        title: {
            type: 'text',
            notNull: true,
        },
        year:{
            type: 'integer',
            notNull: true,
        },
        genre:{
            type: 'text',
            notNull: true,
        },
        performer:{
            type: 'text',
            notNull: true,
        },
        duration:{
            type: 'integer',
        },
        albumId: {
            type: 'varchar(50)',
        }
    });
};


exports.down = pgm => {
    pgm.dropTable('song');
};
