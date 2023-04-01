require('dotenv').config();

const { Pool } = require('pg');
const BadRequestError = require('../../exception/BadRequestError');
const AuthenticationError = require('../../exception/AuthenticationError');
const bcrypt = require('bcrypt')

class pgAuthenticationService{
    constructor(){
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        });
    }

    async addRefreshToken(token) {
        const query = {
          text: 'INSERT INTO authentications VALUES($1)',
          values: [token],
        };
     
        await this._pool.query(query);
    }

    async verifyRefreshToken(token) {
        const query = {
          text: 'SELECT token FROM authentications WHERE token = $1',
          values: [token],
        };
     
        const result = await this._pool.query(query);
     
        if (!result.rows.length) {
          throw new BadRequestError('Refresh token tidak valid');
        }
    }

    async deleteRefreshToken(token) {
        const query = {
          text: 'DELETE FROM authentications WHERE token = $1',
          values: [token],
        };
     
        await this._pool.query(query);
    }

    async verifyUserCredential(username, password) {
      const query = {
        text: 'SELECT id, password FROM users WHERE username = $1',
        values: [username],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rows.length) {
        throw new AuthenticationError('Kredensial yang Anda berikan salah');
      }
  
      const { id, password: hashedPassword } = result.rows[0];
  
      const match = await bcrypt.compare(password, hashedPassword);
  
      if (!match) {
        throw new AuthenticationError('Kredensial yang Anda berikan salah');
      }
  
      return id;
    }
}


module.exports = pgAuthenticationService;