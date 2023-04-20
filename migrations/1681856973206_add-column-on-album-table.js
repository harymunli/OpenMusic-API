/* eslint-disable camelcase */

const { options } = require("joi");

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn("album", { 
        coverUrl: {
            type: 'text'
        }
    },
    {
        ifNotExists: true
    });
};

exports.down = pgm => {
    pgm.dropColumn("album", {coverUrl});
};
