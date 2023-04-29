require('dotenv').config();

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const BadRequestError = require('../../exception/BadRequestError')
const NotFoundError = require('../../exception/NotFoundError')
const CacheService =  require('../redis/CacheService')

class pgAlbumService {
  constructor() {
    this._pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    });
    this._cacheService = new CacheService();
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
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };
    //console.log(id);
    const result = await this._pool.query(query);
    //console.log(result);
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
      text: `UPDATE album SET "coverUrl" = 'http://' || $1 || ':' || $2 || '/albums/images/' || $3 WHERE id = $4;`,
      values: [process.env.HOST, process.env.PORT, filename, id]
    }

    await this._pool.query(query)
  }
  
  async getUserAlbumLikes(user_id, album_id){
    let query = {
      text: 'SELECT * FROM user_album_likes where user_id = $1 and album_id = $2',
      values: [user_id, album_id]
    }
      
    let res = await this._pool.query(query);
    return res;
  }

  async addRowToUserAlbumLike(user_id, album_id){
    let res = await this.getAlbumById(album_id);
    if (!res) throw new NotFoundError('Id Album salah, silahkan input lagi');

    let albumLike = await this.getUserAlbumLikes(user_id, album_id);
    if (albumLike.rows.length) throw new BadRequestError('tidak bisa like lebih dari 1 kali');

    let id = nanoid(16);
    let query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, user_id, album_id]
    }

    res = await this._pool.query(query);
    await this._cacheService.delete(`likes:${album_id}`);
  }

  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return [result, true];
    } catch (error) {
      const query = {
        text: 'SELECT count(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      //console.log(result);
      await this._cacheService.set(`likes:${albumId}`, result.rows[0].count);
      return [result.rows[0].count, false];
    }
  }

  async deleteLikes(albumId, user_id) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 and user_id = $2',
      values: [albumId, user_id],
    };
    await this._pool.query(query);

    await this._cacheService.delete(`likes:${albumId}`);
  }
}

module.exports = pgAlbumService;