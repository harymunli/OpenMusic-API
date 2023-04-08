require('dotenv').config();

const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const BadRequestError = require('../../exception/BadRequestError');
const NotFoundError = require('../../exception/NotFoundError');

class pgPlaylistService{
    constructor(){
        this._pool = new Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        });
    }

    // owner berupa id user
    async addPlaylist({name, owner}){
        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner]
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id){
            throw new BadRequestError('Playlist gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async getAllPlaylist(owner_id){
        const query = {
            text: 'SELECT playlist.id, playlist.name, username from playlist inner join users on users.id=playlist.owner where playlist.owner = $1',
            values: [owner_id]
        }
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('playlist tidak ditemukan');
        }

        return result.rows;
    }

    async getOwnerIdFromPlaylist(playlist_id){
        const query = {
            text: 'select * from playlist where id = $1',
            values: [playlist_id]
        }
        const result = await this._pool.query(query);
        if (!result.rows[0]) {
            throw new NotFoundError('playlist tidak ditemukan');
        }

        return result.rows[0].owner;
    }

    async addSongToPlaylist(playlistId, {songId}){
        let query = {
            text: 'SELECT * FROM playlist WHERE id = $1',
            values: [playlistId]
        }

        let result = await this._pool.query(query);
        if(!result.rows[0]) throw new NotFoundError("playlist tidak ditemukan");

        query = {
            text: 'SELECT * FROM song WHERE id = $1',
            values: [songId]
        }

        result = await this._pool.query(query);
        if(!result.rows[0]) throw new NotFoundError("song tidak ditemukan");

        const id = nanoid(16);
        query = {
            text: 'Insert into playlist_songs values($1, $2, $3) returning id',
            values: [id, playlistId, songId]
        }

        result = await this._pool.query(query);

        if (!result.rows[0].id){
            throw new BadRequestError('Song gagal ditambahkan');
        }
        return result.rows[0].id;
    }

    async getSongsFromPlaylist(playlist_id){
        let query = {
            text: `Select Distinct d.id, d.name, f.username
            from playlist as d inner join playlist_songs as e
            on d.id = e.playlist_id
            inner join users as f
            on d.owner = f.id
            where e.playlist_id = $1`,
            values:[playlist_id]
        }

        let result1 = await this._pool.query(query);
        //console.log(result1.rows);
        if (!result1.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        query = {
            text: `select f.id, f.title, f.performer
            from playlist_songs as e
            inner join song as f 
            on e.song_id = f.id
            where e.playlist_id = $1`, 
            values:[playlist_id]
        }
        let result2 = await this._pool.query(query);
        
        if (!result2.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        result1.rows[0].songs =  result2.rows;

        return result1.rows[0];
    }

    async deleteSongFromPlaylist(playlist_id, song_id){
        let query = {
            text:'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING playlist_id',
            values: [playlist_id, song_id]
        }
        let result = await this._pool.query(query);

        if (!result.rows) {
          throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
        }
        return result.rows[0];
    }

    async deletePlaylist(playlist_id){
        let query = {
            text:'DELETE FROM playlist WHERE id = $1',
            values: [playlist_id]
        }
        let result = await this._pool.query(query);

        if (!result.rows) {
          throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
        return result.rows[0];
    }
}

module.exports = pgPlaylistService;