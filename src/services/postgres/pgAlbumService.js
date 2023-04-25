require('dotenv').config();

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const BadRequestError = require('../../exception/BadRequestError')
const NotFoundError = require('../../exception/NotFoundError')

class pgAlbumService {
  constructor() {
    this._pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });
  }
 
  async addAlbum({name, year}) {
    const id = nanoid(16);
 
    const query = {
      text: 'INSERT INTO album VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
 
    if (!result.rows[0].id) {
      throw new BadRequestError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM Album WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }
  
  async editAlbumById(id, {name, year}) {
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM album WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
  
  async addCoverURLToAlbum(filename, id){
    const query = {
      name: 'add-cover-album',
      text: `UPDATE album SET coverurl = \'http://$1:$2/albums/images/$3\' WHERE id = \'$4\'`,
      values: [process.env.HOST, process.env.PORT, filename, id]
    }

    await this._pool.query(query, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        if (!res.rows.length) {
          throw new NotFoundError('Album tidak ditemukan');
        }
      }
    })
  } 
}

module.exports = pgAlbumService;