//exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('album', {
        id: {
            type: 'varchar(50)',
            primaryKey: true,
        },
        name: {
            type: 'text',
            notNull: true,
        },
        year:{
            type: 'text',
            notNull: true,
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
    pgm.dropTable('album');
};

/* eslint-disable camelcase */
 
// exports.shorthands = undefined;
 
// exports.up = (pgm) => {
//   pgm.createTable('notes', {
//     id: {
//       type: 'VARCHAR(50)',
//       primaryKey: true,
//     },
//     title: {
//       type: 'TEXT',
//       notNull: true,
//     },
//     body: {
//       type: 'TEXT',
//       notNull: true,
//     },
//     tags: {
//       type: 'TEXT[]',
//       notNull: true,
//     },
//     created_at: {
//       type: 'TEXT',
//       notNull: true,
//     },
//     updated_at: {
//       type: 'TEXT',
//       notNull: true,
//     },
//   });
// };
 
// exports.down = (pgm) => {
//   pgm.dropTable('notes');
// };