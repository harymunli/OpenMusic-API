const { nanoid } = require('nanoid');

class SongService{
    constructor(){
        this._song = [];
    }

    addSong({title, year, genre, performer, duration, albumId}){
        const id = nanoid(16);

        const newSong = {
            id, title, year, genre, performer, duration, albumId
        };

        this._song.push(newSong);

        const isSuccess = this._song.filter((song) => song.id === id).length > 0;
        
        if(!isSuccess){
            throw new Error('Lagu gagal ditambahkan');
        }

        return id;
    }

    getSongById(id) {
        const a = this._song.filter((a) => a.id === id)[0];
        return a;
    }

    getSongs(){
        return this._song;
    }

    editSongById(id, {title, year, genre, performer, duration, albumId}){
        const index = this._song.findIndex((a) => a.id === id);

        this._song[index] = {
            ...this._song[index],
            title,
            year,
            genre,
            performer,
            duration,
            albumId
        }
    }

    deleteSongById(id) {
        const index = this._song.findIndex((a) => a.id === id);
        this._song.splice(index, 1);
    }
}

module.exports = SongService;