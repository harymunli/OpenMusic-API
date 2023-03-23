require('dotenv').config();

const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class pgSongService{
    constructor(){
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        });
    }

    async addSong({title, year, genre, performer, duration, albumId}){
        const id = nanoid(16);

        const query = {
            text: 'INSERT INTO song VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId],
        };
    
        const result = await this._pool.query(query);
        
        if (!result.rows[0].id) {
            throw new InvariantError('Catatan gagal ditambahkan');
          }

        return result.rows[0].id;
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM song WHERE id = $1',
            values: [id],
          };
          const result = await this._pool.query(query);
      
          if (!result.rows.length) {
            throw new NotFoundError('Catatan tidak ditemukan');
          }
          
          return result.rows;
    }

    async getSongs(){
        const result = await this._pool.query('SELECT id, title, performer FROM song');
        return result.rows;
    }

    async editSongById(id, {title, year, genre, performer, duration, albumId}){
        const updatedAt = new Date().toISOString();
        const query = {
        text: 'UPDATE song SET title = $1, year = $2, gere = $3, performer = $4 duration = $5, albumId = $6, WHERE id = $7 RETURNING id',
        values: [title, year, genre, performer, duration, albumId, id],
        };
        
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
            values: [id],
          };
      
          const result = await this._pool.query(query);
      
          if (!result.rows.length) {
            throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = pgSongService;