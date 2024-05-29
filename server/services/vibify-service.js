const express =require('express');
const Model = require('../model/model')

class VibifyService{
    async getNRandomSongsGivenValenceAndEnergy(valence,energy,n) {
        try{
            const data = await Model.aggregate([
                {
                    $match:{valence:{$lt:valence+0.1,$gt:valence-0.1},
                        energy:{$lt:energy+0.1,$gt:energy-0.1}
                    }
                },
                {$project:{_id:0,track_id:1}},
                {$sample:{size:n}}
            ]);
            return data;
        }
        catch(error){
            return error.message;
        }
    }
    async getSongCountForValenceAndEnergy(valence,energy){
        try{
            const data = await Model.find({
                valence:{$lt:valence+0.1,$gt:valence-0.1},
                energy:{$lt:energy+0.1,$gt:energy-0.1}}).count();
            return data;
        }
        catch(error){
            return error.message;
        }
    }
}

module.exports = VibifyService;
