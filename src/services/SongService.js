const { nanoid } = require('nanoid');

class SongService{
    constructor(){
        this._song = [];
    }

    addSong({title, year, genre, perfomer, duration, albumId}){
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const newSong = {
            id, title, year, genre, perfomer, duration, albumId, createdAt, updatedAt
        };
        console.log(newSong);

        this._song.push(newSong);

        const isSuccess = this._song.filter((album) => album.id === id).length > 0;
        
        if(!isSuccess){
            throw new Error('Lagu gagal ditambahkan');
        }

        return id;
    }

}

module.exports = SongService;