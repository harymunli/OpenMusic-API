require('dotenv').config();

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require("bcrypt");
const BadRequestError = require('../../exception/BadRequestError')

class pgUserService{
    constructor(){
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        });
    }

    async addUser({username, password, fullname}){
        await this.verifyNewUsername(username);

        const id = `user-${nanoid(16)}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = {
            text: 'INSERT INTO users VALUES($1,$2,$3,$4) RETURNING id',
            values: [id, username, hashedPassword, fullname]
        }

        const result = await this._pool.query(query);

        if(!result.rows.length){
            throw new BadRequestError('User gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async verifyNewUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username]
        };

        const result = await this._pool.query(query);

        if(result.rows.length>0){
            throw new BadRequestError("Username sudah digunakan. Gagal menambahkan user");
        }
    }
}

module.exports = pgUserService;