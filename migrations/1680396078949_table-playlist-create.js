/* eslint-disable camelcase */
// exports.shorthands = undefined;


exports.up = pgm => {
    pgm.createTable('playlist', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        name: {
            type: "TEXT",
            notNull: true,
        },
        songId: {
            type: 'varchar(50)',
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlist');
};
