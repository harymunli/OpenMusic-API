/* eslint-disable camelcase */

exports.shorthands = undefined;

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
            type: 'text',
        },
        albumId: {
            type: 'varchar(50)',
        },
        created_at:{
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at:{
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        }
    });
};


exports.down = pgm => {
    pgm.dropTable('song');
};
